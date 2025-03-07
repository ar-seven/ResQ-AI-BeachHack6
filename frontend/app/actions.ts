"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { permanentRedirect, redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  console.log("🚀 ~ signUpAction ~ formData:", formData)
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("name")?.toString();
  const phone= formData.get("phone")?.toString();
  const age = formData.get("age") ? Number(formData.get("age")) : null;
  const gender = formData.get("gender")?.toString();
  const allergies = formData.get("allergies")?.toString();
  const medicalHistory = formData.get("medicalHistory")?.toString();
  const emergency_name = formData.get("emergencyName")?.toString();
  const emergencyPhone = formData.get("emergencyPhone")?.toString();
  const relationship = formData.get("relationship")?.toString();

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password || !fullName || !age || !gender || !emergency_name) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "All fields are required",
    );
  }

  // Sign up the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data : {
        first_name: fullName,
        age,
      }
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  const userId = data?.user?.id;

  if (userId) {
    console.log("🚀 ~ signUpAction ~ userId:", userId)
    // Insert user profile details into the 'profiles' table
    const { data,error: profileError } = await supabase.from("profiles").update(
      {
        full_name: fullName,
        age: age,
        gender:gender,
        contact_phone: phone,
        medical_history: medicalHistory,
        emergency_name:emergency_name,
        emergency_phone: emergencyPhone,
        relationship:relationship,
        allergies:allergies,
      }).eq("id", userId);

    console.log("🚀 ~ signUpAction ~ data:", data)
    console.log("🚀 ~ signUpAction ~ profileError:", profileError)

    if (profileError) {
      console.error("Profile Insert Error: ", profileError.message);
      return encodedRedirect(
        "error",
        "/sign-up",
        "Sign-up successful, but failed to save user details.",
      );
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};


export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
