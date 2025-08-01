import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Loader, XCircle } from "lucide-react";

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setIsSuccess(false);
      setIsVerifying(false);
      return;
    }

    const verify = async () => {
      try {
        setIsVerifying(true);

        // Encode token before sending
        const encodedToken = encodeURIComponent(token);

        const res = await fetch(
          `http://localhost:5000/api-v1/auth/verify-email/${encodedToken}`,
          {
            method: "GET",
          }
        );

        if (res.ok) {
          const data = await res.json();
          setIsSuccess(true);

          if (data.token) {
            // Save token if present
            localStorage.setItem("authToken", data.token);
          }

          // ✅ DO NOT auto-redirect
        } else {
          const errData = await res.json();
          console.error("Verification failed:", errData);
          setIsSuccess(false);
        }
      } catch (error) {
        console.error("Verification error:", error);
        setIsSuccess(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verify();
  }, [token]);

  const handleBack = () => {
    navigate("/sign-in");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-2xl font-bold text-center">Verify Email</h1>
      <p className="text-sm text-gray-500 text-center mt-1">
        {isVerifying ? "Verifying your email..." : ""}
      </p>

      <Card className="w-full max-w-md mt-6 shadow-md border border-gray-200">
        <CardHeader className="border-b border-gray-100 px-6 py-4" />
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            {isVerifying ? (
              <>
                <Loader className="w-10 h-10 text-gray-500 animate-spin" />
                <h3 className="text-lg font-semibold">Verifying email...</h3>
                <p className="text-sm text-gray-500">
                  Please wait while we verify your email.
                </p>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="w-10 h-10 text-green-500 mb-2" aria-hidden="true" />
                <h3 className="text-lg font-semibold">Email Verified</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Your email has been verified successfully.
                </p>
              </>
            ) : (
              <>
                <XCircle className="w-10 h-10 text-red-500 mb-2" aria-hidden="true" />
                <h3 className="text-lg font-semibold">Email Verification Failed</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Your email verification failed. Please try again.
                </p>
              </>
            )}

            {!isVerifying && (
              <button
                onClick={handleBack}
                className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                Back to Sign in
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
