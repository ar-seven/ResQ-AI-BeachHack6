"use client";
import { useGetUserProfile } from "@/utils/hooks/user";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarInset } from "@/components/ui/sidebar";

const DetailsPage: React.FC = () => {
  const { data: userProfile } = useGetUserProfile();

  if (!userProfile) {
    return <div>Loading...</div>; // Or a nice loading skeleton
  }

  return (
    <div>
      <div className="flex flex-col h-screen p-4">
        {" "}
        <div className="p-5">
          <SidebarInset>
            <Breadcrumb>
              <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/protected">
                Protected Page
              </BreadcrumbLink>
            </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </SidebarInset>
        </div>

      <div className="pl-4">
        <Card className="w-[1000px] max-w-full mx-auto ">
          <CardHeader>
            <CardTitle>
              {userProfile.full_name || userProfile.username}
            </CardTitle>
            <CardDescription>User Profile Details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              {userProfile.avatar_url && (
                <img
                  src={userProfile.avatar_url}
                  alt="User Avatar"
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
              <div>
                <p>
                  <strong>Username:</strong> {userProfile.username}
                </p>
                <p>
                  <strong>Full Name:</strong> {userProfile.full_name}
                </p>
                <p>
                  <strong>Contact Phone:</strong> {userProfile.contact_phone}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Personal Information
              </h3>
              <p>
                <strong>Age:</strong> {userProfile.age}
              </p>
              <p>
                <strong>Gender:</strong> {userProfile.gender}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Medical Information
              </h3>
              <p>
                <strong>Allergies:</strong> {userProfile.allergies || "None"}
              </p>
              <p>
                <strong>Medical History:</strong>{" "}
                {userProfile.medical_history || "None"}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">Emergency Contact</h3>
              <p>
                <strong>Name:</strong> {userProfile.emergency_name}
              </p>
              <p>
                <strong>Phone:</strong> {userProfile.emergency_phone}
              </p>
              <p>
                <strong>Relationship:</strong> {userProfile.relationship}
              </p>
            </div>
            <Separator />

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                ID: {userProfile.id.substring(0, 8)}...
              </Badge>
              <Badge variant="outline">
                Updated: 02/03/2025
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default DetailsPage;
