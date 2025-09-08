
import { createClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const formData = await request.formData();
  const optionIndex = parseInt(formData.get('optionIndex') as string, 10);
  const pollId = params.id;

  if (isNaN(optionIndex)) {
    return new NextResponse(JSON.stringify({ error: 'Invalid option selected.' }), { status: 400 });
  }

  const { error } = await supabase
    .from('votes')
    .insert({ poll_id: pollId, option_index: optionIndex, user_id: user.id });

  if (error) {
    console.error('Error recording vote:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }

  revalidatePath(`/polls/${pollId}`);
  return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
}
