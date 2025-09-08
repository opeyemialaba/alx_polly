import { createPoll, voteOnPoll } from '@/lib/actions';
import { createClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Explicitly cast the mocked functions for better TypeScript support
const mockCreateClient = createClient as jest.Mock;
const mockGetUser = jest.fn();
const mockInsert = jest.fn();
const mockSelect = jest.fn();
const mockSingle = jest.fn();
const mockRevalidatePath = revalidatePath as jest.Mock;
const mockRedirect = redirect as jest.Mock;

describe('Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test

    // Reset mock implementations for Supabase client
    mockSingle.mockResolvedValue({ data: { id: 'new-poll-id' }, error: null });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: mockGetUser,
      },
      from: jest.fn(() => ({
        insert: mockInsert,
      })),
    });
    mockGetUser.mockResolvedValue({ data: { user: { id: 'test-user-id', email: 'test@example.com' } }, error: null });
  });

  describe('createPoll', () => {
    it('should create a poll and redirect on success', async () => {
      const formData = new FormData();
      formData.append('question', 'Test Question');
      formData.append('options', 'Option 1\nOption 2');

      await createPoll(formData);

      expect(mockGetUser).toHaveBeenCalled();
      expect(mockInsert).toHaveBeenCalledWith({
        question: 'Test Question',
        options: ['Option 1', 'Option 2'],
        user_id: 'test-user-id',
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith('/');
      expect(mockRedirect).toHaveBeenCalledWith('/poll/new-poll-id');
    });

    it('should return an error if user is not authenticated', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: null });
      const formData = new FormData();
      formData.append('question', 'Test Question');
      formData.append('options', 'Option 1\nOption 2');

      await createPoll(formData);

      expect(mockGetUser).toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledWith('/auth/login');
      expect(mockInsert).not.toHaveBeenCalled();
    });

    it('should return an error if question is missing', async () => {
      const formData = new FormData();
      formData.append('options', 'Option 1\nOption 2');

      const result = await createPoll(formData);

      expect(result).toEqual({ error: 'Please provide a question and at least two options.' });
      expect(mockInsert).not.toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it('should return an error if less than two options are provided', async () => {
      const formData = new FormData();
      formData.append('question', 'Test Question');
      formData.append('options', 'Option 1');

      const result = await createPoll(formData);

      expect(result).toEqual({ error: 'Please provide a question and at least two options.' });
      expect(mockInsert).not.toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it('should return a database error if poll creation fails', async () => {
      mockInsert.mockReturnValueOnce({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'DB Error' } }) }) });

      const formData = new FormData();
      formData.append('question', 'Test Question');
      formData.append('options', 'Option 1\nOption 2');

      const result = await createPoll(formData);

      expect(result).toEqual({ error: 'DB Error' });
      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });

  describe('voteOnPoll', () => {
    it('should record a vote and revalidate path on success', async () => {
      const formData = new FormData();
      formData.append('pollId', 'test-poll-id');
      formData.append('optionIndex', '0');

      await voteOnPoll(formData);

      expect(mockGetUser).toHaveBeenCalled();
      expect(mockInsert).toHaveBeenCalledWith({
        poll_id: 'test-poll-id',
        option_index: 0,
        user_id: 'test-user-id',
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith('/polls/test-poll-id');
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it('should return an error if user is not authenticated', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: null });
      const formData = new FormData();
      formData.append('pollId', 'test-poll-id');
      formData.append('optionIndex', '0');

      await voteOnPoll(formData);

      expect(mockGetUser).toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledWith('/auth/login');
      expect(mockInsert).not.toHaveBeenCalled();
    });

    it('should return an error for invalid poll ID', async () => {
      const formData = new FormData();
      formData.append('optionIndex', '0');

      const result = await voteOnPoll(formData);

      expect(result).toEqual({ error: 'Invalid poll or option selected.' });
      expect(mockInsert).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it('should return an error for invalid option index', async () => {
      const formData = new FormData();
      formData.append('pollId', 'test-poll-id');
      formData.append('optionIndex', 'not-a-number');

      const result = await voteOnPoll(formData);

      expect(result).toEqual({ error: 'Invalid poll or option selected.' });
      expect(mockInsert).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it('should return a database error if vote recording fails', async () => {
      mockInsert.mockResolvedValueOnce({ data: null, error: { message: 'Vote DB Error' } });

      const formData = new FormData();
      formData.append('pollId', 'test-poll-id');
      formData.append('optionIndex', '0');

      const result = await voteOnPoll(formData);

      expect(result).toEqual({ error: 'Vote DB Error' });
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });
  });
});
