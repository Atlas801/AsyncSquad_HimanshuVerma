import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role === 'seller') {
      return NextResponse.json({ error: 'Sellers cannot place orders' }, { status: 403 });
    }

    const orderData = await req.json();

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        buyer_id: session.user.id,
        seller_id: orderData.seller_id,
        total_amount: orderData.total,
        status: 'pending',
      }])
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // Insert order items
    const orderItems = orderData.items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.qty,
      price_at_time: item.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    
    if (itemsError) {
      // Revert order if items fail?? Usually want a transaction but Supabase REST lacks it 
      // without an RPC. We'll simply return error here.
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    // Decrement stock for each item using RPC
    for (const item of orderData.items) {
      await supabase.rpc('decrement_stock', { p_id: item.product_id, qty: item.qty });
    }

    return NextResponse.json(order);
  } catch (err: any) {
    console.error('Checkout API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
