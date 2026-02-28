import { Button } from "@/components/common";
import { TextField } from "@/components/inputs";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useLoginPage } from "./useLoginPage";

export default function LoginPage() {
  const { register, handleSubmit, errors, onSubmit, isLoading } =
    useLoginPage();

  return (
    <div className="bg-background flex min-h-[92vh] items-center justify-center px-4">
      <div className="bg-background-elevated border-border shadow-card w-full max-w-md rounded-lg border p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-foreground mb-2 text-3xl font-bold">Login</h1>
          <p className="text-foreground-muted">
            Please enter your credentials to continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <TextField
            label="Email"
            type="email"
            placeholder="Enter your email"
            icon={<EnvelopeIcon className="h-5 w-5" />}
            register={register("email")}
            error={errors.email}
          />

          <TextField
            label="Password"
            type="password"
            placeholder="Enter your password"
            icon={<LockClosedIcon className="h-5 w-5" />}
            register={register("password")}
            error={errors.password}
          />

          {/* Submit Button */}
          <div className="mt-12 flex items-center justify-center">
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
