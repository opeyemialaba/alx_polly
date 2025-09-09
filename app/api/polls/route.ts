
import { createClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.from('polls').select('*');

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new NextResponse(JSON.stringify(data), { status: 200 });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const formData = await request.formData();
  const question = formData.get('question') as string;
  const optionsString = formData.get('options') as string;
  const options = optionsString.split('\n').map(option => option.trim()).filter(option => option.length > 0);

  if (!question || options.length < 2) {
    return new NextResponse(JSON.stringify({ error: 'Please provide a question and at least two options.' }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('polls')
    .insert({ question, options, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error('Error creating poll:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }

  revalidatePath('/');
  return new NextResponse(JSON.stringify({ id: data.id }), { status: 201 });
}
