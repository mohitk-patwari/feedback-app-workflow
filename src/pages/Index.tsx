import { FeedbackForm } from "@/components/FeedbackForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Feedback Form
          </h1>
          <p className="text-muted-foreground">
            We'd love to hear your thoughts and suggestions
          </p>
        </div>
        <FeedbackForm />
      </div>
    </div>
  );
};

export default Index;
