import { Comments } from '@/components/Comments';

export default function WineCommentsPage() {
  const handleSubmit = (name: string, message: string) => {
    // Handle comment submission
    console.log('Submit comment:', { name, message });
  };

  return (
    <div className="py-8">
      <Comments onSubmit={handleSubmit} />
    </div>
  );
}

