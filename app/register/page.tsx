"use client";

import { registerUser } from "@/app/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Gender, Role, TshirtSize } from "@prisma/client";
import { Zap, Flag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface RegisterFormData {
  // Common fields
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: string;
  address: string;
  
  // Runner specific fields
  tshirtSize: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  
  // Marshal specific fields
  organizationName: string;
  rolePosition: string;
  socialMediaLinks: string;
  responsibilities: string;
}

interface StepType {
  name: string;
  fields: string[];
}

// Define steps for both user types
const steps: Record<Extract<Role, "Runner" | "Marshal">, StepType[]> = {
  Runner: [
    { name: "Account Information", fields: ["name", "email", "password"] },
    { name: "Personal Details", fields: ["phoneNumber", "dateOfBirth", "gender", "address"] },
    { name: "Runner Information", fields: ["tshirtSize"] },
    { name: "Emergency Contact", fields: ["emergencyContactName", "emergencyContactPhone", "emergencyContactRelationship"] },
  ],
  Marshal: [
    { name: "Account Information", fields: ["name", "email", "password"] },
    { name: "Personal Details", fields: ["phoneNumber", "dateOfBirth", "gender", "address"] },
    { name: "Professional Details", fields: ["organizationName", "rolePosition", "socialMediaLinks", "responsibilities"] },
  ]
};

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [selectedRole, setSelectedRole] = useState<Extract<Role, "Runner" | "Marshal">>("Runner");
  const [currentStep, setCurrentStep] = useState(0);
  const [iconVisible, setIconVisible] = useState(false);

  // Get the appropriate steps based on selected role
  const roleSteps = steps[selectedRole];
  
  useEffect(() => {
    // Trigger the animation after component mounts
    setIconVisible(true);
  }, []);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    reset
  } = useForm<RegisterFormData>({
    mode: "onChange"
  });
  
  // Get the date of birth value
  const dateOfBirth = watch("dateOfBirth");

  // Reset form when role changes
  const handleRoleChange = (role: Extract<Role, "Runner" | "Marshal">) => {
    if (role === selectedRole) return;
    setSelectedRole(role);
    setCurrentStep(0);
    reset();
    
    // Reset animation to trigger it again
    setIconVisible(false);
    setTimeout(() => setIconVisible(true), 50);
  };

  // Handle date selection
  const handleDateChange = (date: Date | undefined) => {
    setValue("dateOfBirth", date as Date, { shouldValidate: true });
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, roleSteps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const processForm: SubmitHandler<RegisterFormData> = async (data) => {
    setError(undefined);
    
    try {
      // For initial registration, we'll just pass the basic user info
      const result = await registerUser(
        data.name,
        data.email,
        data.password,
        selectedRole,
        data.phoneNumber || undefined
      );
      
      if (result.error) {
        setError(result.error);
        return;
      }
      
      // TODO: Create profile based on selected role and form data
      
      // Redirect to login page after successful registration
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  // Render field based on type
  const renderField = (fieldName: string) => {
    switch (fieldName) {
      case "name":
        return (
          <div className="space-y-2" key={fieldName}>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              {...register("name", { required: "Full name is required" })}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
        );
      case "email":
        return (
          <div className="space-y-2" key={fieldName}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
        );
      case "password":
        return (
          <div className="space-y-2" key={fieldName}>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Choose a password"
              {...register("password", { 
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters"
                }
              })}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
        );
      case "phoneNumber":
        return (
          <div className="space-y-2" key={fieldName}>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              {...register("phoneNumber", { required: "Phone number is required" })}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
          </div>
        );
      case "dateOfBirth":
        return (
          <div className="space-y-2" key={fieldName}>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <DatePicker
              date={dateOfBirth}
              setDate={handleDateChange}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>}
          </div>
        );
      case "gender":
        return (
          <div className="space-y-2" key={fieldName}>
            <Label htmlFor="gender">Gender</Label>
            <select
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              id="gender"
              {...register("gender", { required: "Gender is required" })}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
          </div>
        );
      case "address":
        return (
          <div className="space-y-2" key={fieldName}>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Enter your address"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
          </div>
        );
      case "tshirtSize":
        return (
          <div className="space-y-2" key={fieldName}>
            <Label htmlFor="tshirtSize">T-Shirt Size</Label>
            <select
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              id="tshirtSize"
              {...register("tshirtSize", { required: "T-shirt size is required" })}
            >
              <option value="">Select size</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
            {errors.tshirtSize && <p className="text-red-500 text-sm">{errors.tshirtSize.message}</p>}
          </div>
        );
      case "emergencyContactName":
        return (
          <div className="space-y-2" key={fieldName}>
            <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
            <Input
              id="emergencyContactName"
              placeholder="Emergency contact full name"
              {...register("emergencyContactName", { required: "Emergency contact name is required" })}
            />
            {errors.emergencyContactName && <p className="text-red-500 text-sm">{errors.emergencyContactName.message}</p>}
          </div>
        );
      case "emergencyContactPhone":
        return (
          <div className="space-y-2" key={fieldName}>
            <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
            <Input
              id="emergencyContactPhone"
              type="tel"
              placeholder="Emergency contact phone number"
              {...register("emergencyContactPhone", { required: "Emergency contact phone is required" })}
            />
            {errors.emergencyContactPhone && <p className="text-red-500 text-sm">{errors.emergencyContactPhone.message}</p>}
          </div>
        );
      case "emergencyContactRelationship":
        return (
          <div className="space-y-2" key={fieldName}>
            <Label htmlFor="emergencyContactRelationship">Relationship to Emergency Contact</Label>
            <Input
              id="emergencyContactRelationship"
              placeholder="e.g., Parent, Spouse, Friend"
              {...register("emergencyContactRelationship", { required: "Relationship is required" })}
            />
            {errors.emergencyContactRelationship && <p className="text-red-500 text-sm">{errors.emergencyContactRelationship.message}</p>}
          </div>
        );
      case "organizationName":
        return (
          <div className="space-y-2" key={fieldName}>
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input
              id="organizationName"
              placeholder="Name of your organization"
              {...register("organizationName", { required: "Organization name is required" })}
            />
            {errors.organizationName && <p className="text-red-500 text-sm">{errors.organizationName.message}</p>}
          </div>
        );
      case "rolePosition":
        return (
          <div className="space-y-2" key={fieldName}>
            <Label htmlFor="rolePosition">Role/Position</Label>
            <Input
              id="rolePosition"
              placeholder="Your role or position"
              {...register("rolePosition", { required: "Role/Position is required" })}
            />
            {errors.rolePosition && <p className="text-red-500 text-sm">{errors.rolePosition.message}</p>}
          </div>
        );
      case "socialMediaLinks":
        return (
          <div className="space-y-2" key={fieldName}>
            <Label htmlFor="socialMediaLinks">Social Media Links (Optional)</Label>
            <Input
              id="socialMediaLinks"
              placeholder="Your social media links"
              {...register("socialMediaLinks")}
            />
          </div>
        );
      case "responsibilities":
        return (
          <div className="space-y-2" key={fieldName}>
            <Label htmlFor="responsibilities">Responsibilities</Label>
            <Textarea
              id="responsibilities"
              placeholder="Describe your responsibilities"
              className="min-h-[100px]"
              {...register("responsibilities", { required: "Responsibilities description is required" })}
            />
            {errors.responsibilities && <p className="text-red-500 text-sm">{errors.responsibilities.message}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  // Generate step indicators - improved modern UI
  const renderStepIndicators = () => {
    return (
      <div className="flex items-start justify-between px-2 py-3 bg-gray-50 rounded-lg mb-6 relative">
        {roleSteps.map((step: StepType, index: number) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isUpcoming = index > currentStep;
          
          return (
            <div key={index} className="flex flex-col items-center relative flex-1 px-1">
              {/* Line connector FROM previous step */}
              {index > 0 && (
                <div className={`absolute right-1/2 top-4 h-[3px] w-full z-0 ${isCompleted || isActive ? 'bg-accent' : 'bg-muted'}`}>
                  {/* Fill effect for active step */}
                  {isActive && <div className="absolute right-0 top-0 h-[3px] w-1/2 bg-muted z-10"></div>}
                </div>
              )}
              
              {/* Line connector TO next step */}
              {index < roleSteps.length - 1 && (
                <div className={`absolute left-1/2 top-4 h-[3px] w-full z-0 ${isCompleted ? 'bg-accent' : 'bg-muted'}`}>
                  {/* Fill effect for active step */}
                  {isActive && <div className="absolute left-0 top-0 h-[3px] w-1/2 bg-muted z-10"></div>}
                </div>
              )}

              {/* Circle indicator */}
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center z-20 transition-all duration-300 shadow-sm relative ${ 
                  isCompleted 
                    ? 'bg-accent text-accent-foreground' 
                    : isActive 
                      ? 'bg-background text-accent ring-2 ring-accent' 
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                ) : (
                  index + 1
                )}
              </div>
              
              {/* Step name */}
              <span className={`text-xs mt-1 font-medium transition-colors ${ 
                isCompleted || isActive ? 'text-accent' : 'text-muted-foreground'
              }`}>
                {step.name.split(' ')[0]}
              </span>
            </div>
          )}
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4 h-16 relative">
          <div 
            className={`transition-all duration-500 ease-out absolute ${
              iconVisible 
                ? 'opacity-100 transform translate-y-0' 
                : 'opacity-0 transform translate-y-10'
            }`}
          >
            {selectedRole === "Runner" ? (
              <Zap className="h-16 w-16 text-accent" />
            ) : (
              <Flag className="h-16 w-16 text-accent" />
            )}
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Create a {selectedRole} Account</h1>
        <p className="mt-2 text-foreground-secondary">
          Join us and participate in exciting fun run events
        </p>
      </div>

      <div className="flex justify-center space-x-4 mb-6 w-full max-w-md">
        <button
          type="button"
          onClick={() => handleRoleChange("Runner")}
          className={`flex-1 cursor-pointer py-4 px-6 rounded-md transition-all duration-300 text-lg font-medium shadow-md hover:shadow-lg border-2 ${
            selectedRole === "Runner"
              ? "bg-accent text-accent-foreground border-accent hover:bg-accent/90"
              : "bg-muted text-foreground hover:bg-muted/80 border-muted hover:border-accent/50"
          }`}
        >
          Runner
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange("Marshal")}
          className={`flex-1 cursor-pointer py-4 px-6 rounded-md transition-all duration-300 text-lg font-medium shadow-md hover:shadow-lg border-2 ${
            selectedRole === "Marshal"
              ? "bg-accent text-accent-foreground border-accent hover:bg-accent/90"
              : "bg-muted text-foreground hover:bg-muted/80 border-muted hover:border-accent/50"
          }`}
        >
          Marshal
        </button>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="pb-0">
          {renderStepIndicators()}
          <CardTitle className="text-center">{roleSteps[currentStep].name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="registerForm" onSubmit={handleSubmit(processForm)}>
            <div className="space-y-4">
              {roleSteps[currentStep].fields.map(fieldName => 
                renderField(fieldName)
              )}
              
              {error && (
                <div className="rounded-md bg-destructive/10 p-4 mt-4">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              
              <div className="flex justify-between mt-6">
                {currentStep > 0 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                  >
                    Previous
                  </Button>
                )}
                
                {currentStep < roleSteps.length - 1 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="ml-auto"
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    className="ml-auto"
                  >
                    Create Account
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="mt-4 text-center">
        <p className="text-foreground-secondary">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
} 