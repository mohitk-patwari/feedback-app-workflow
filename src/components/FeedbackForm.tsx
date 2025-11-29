import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { externalSupabase } from "@/lib/externalSupabase";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  name: string;
  email: string;
  rating: string;
  category: string;
  comment: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  rating?: string;
}

export const FeedbackForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    rating: "",
    category: "",
    comment: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.rating) {
      newErrors.rating = "Please select a rating";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await externalSupabase.from('feedbacks').insert({
        name: formData.name,
        email: formData.email,
        rating: parseInt(formData.rating),
        category: formData.category || null,
        message: formData.comment,
      });

      if (error) {
        throw error;
      }

      setShowSuccess(true);
      toast({
        title: "Success!",
        description: "Your feedback has been submitted successfully.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        rating: "",
        category: "",
        comment: "",
      });
      
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="shadow-[var(--shadow-medium)]">
        <CardHeader>
          <CardTitle className="text-2xl">Feedback Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Your full name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your.email@example.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">
                Rating <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.rating}
                onValueChange={(value) => handleInputChange("rating", value)}
              >
                <SelectTrigger
                  id="rating"
                  className={errors.rating ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select a rating" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="5">5 - Excellent</SelectItem>
                  <SelectItem value="4">4 - Good</SelectItem>
                  <SelectItem value="3">3 - Average</SelectItem>
                  <SelectItem value="2">2 - Poor</SelectItem>
                  <SelectItem value="1">1 - Very Poor</SelectItem>
                </SelectContent>
              </Select>
              {errors.rating && (
                <p className="text-sm text-destructive">{errors.rating}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="praise">Praise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => handleInputChange("comment", e.target.value)}
                placeholder="Tell us what you think..."
                rows={5}
                className="resize-none"
              />
            </div>

            {showSuccess && (
              <Alert className="border-success bg-success/10">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertDescription className="text-success-foreground">
                  Your feedback has been submitted successfully!
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-medium)] bg-accent/30">
        <CardHeader>
          <CardTitle className="text-2xl">Your Feedback Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Name
            </p>
            <p className="text-foreground">
              {formData.name || (
                <span className="text-muted-foreground italic">Not provided</span>
              )}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Email
            </p>
            <p className="text-foreground">
              {formData.email || (
                <span className="text-muted-foreground italic">Not provided</span>
              )}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Rating
            </p>
            <p className="text-foreground">
              {formData.rating ? (
                <span className="inline-flex items-center gap-1">
                  {formData.rating} / 5
                  <span className="text-primary">{"★".repeat(Number(formData.rating))}</span>
                </span>
              ) : (
                <span className="text-muted-foreground italic">Not selected</span>
              )}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Category
            </p>
            <p className="text-foreground capitalize">
              {formData.category || (
                <span className="text-muted-foreground italic">Not selected</span>
              )}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Comment
            </p>
            <p className="text-foreground whitespace-pre-wrap">
              {formData.comment || (
                <span className="text-muted-foreground italic">No comment yet</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
