'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MapPin, Siren, Clock, User, ToggleLeft, ToggleRight } from 'lucide-react'
import { useGetAllUserCases } from '@/utils/hooks/user'
import { useEffect } from 'react'
// Define the Case type with patient profile
interface EmergencyCase {
  id: number
  user_id: string
  description: string
  case_type: string
  created_at: string
  priority: 'high' | 'medium' | 'low'
  assigned_agency: 'ambulance' | 'fire_department' | 'police'
  latitude: string
  longitude: string
  resolved: boolean
  profiles: {
    id: string
    age: number
    gender: string
    allergies: string
    full_name: string
    relationship: string
    contact_phone: string
    emergency_name: string
    emergency_phone: string
    medical_history: string
  }
}

// Dummy data (replace with API fetch)
const dummyCases: EmergencyCase[] = [
  {
    id: 1,
    user_id: "d653cac4-fc69-44ac-8266-c3f87d3b1e26",
    description: "Patient has sustained a broken leg and is bleeding badly.",
    case_type: "bleeding",
    created_at: "2025-03-07T22:45:47.469434+00:00",
    priority: "high",
    assigned_agency: "ambulance",
    latitude: "10.047943",
    longitude: "76.3695167",
    resolved: true,
    profiles: {
      id: "d653cac4-fc69-44ac-8266-c3f87d3b1e26",
      age: 21,
      gender: "male",
      allergies: "Penicillin\r\nPeanuts\r\nDust mites",
      full_name: "R Aravind",
      relationship: "parent",
      contact_phone: "+91123123213",
      emergency_name: "Radhakrishnan",
      emergency_phone: "+91 38883289",
      medical_history: "Type 2 Diabetes\r\nHypertension\r\nAsthma (childhood)\r\nPrevious surgery: Appendectomy (2018)",
    },
  },
  // Add more cases as needed
]

export default function AdminPage() {
  const [cases, setCases] = useState<EmergencyCase[]>(dummyCases)
  const [selectedCase, setSelectedCase] = useState<EmergencyCase | null>(null)
  const {data,isLoading,isSuccess} = useGetAllUserCases();



useEffect(() => {
    if (isSuccess && data) {
        setCases(data)
    }
}, [isSuccess, data])

  // Toggle resolved status
  const toggleResolved = (caseId: number) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId ? { ...c, resolved: !c.resolved } : c
      )
    )
    // Optionally send an API request here to update the backend:
    // fetch(`/api/cases/${caseId}`, { method: 'PATCH', body: JSON.stringify({ resolved: !cases.find(c => c.id === caseId)?.resolved }) })
  }

  // Priority badge styling
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500 text-white">High</Badge>
      case 'medium':
        return <Badge className="bg-yellow-500 text-black">Medium</Badge>
      case 'low':
        return <Badge className="bg-green-500 text-black">Low</Badge>
      default:
        return <Badge>{priority}</Badge>
    }
  }

  // Agency icon and color
  const getAgencyIcon = (agency: string) => {
    switch (agency) {
      case 'ambulance':
        return <Siren className="h-4 w-4 text-red-600" />
      case 'fire_department':
        return <Siren className="h-4 w-4 text-orange-600" />
      case 'police':
        return <Siren className="h-4 w-4 text-blue-600" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6 text-blue-500" />
            Admin: Emergency Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((caseItem) => (
                <TableRow key={caseItem.id} className="hover:bg-muted/50">
                  <TableCell>{caseItem.id}</TableCell>
                  <TableCell className="font-medium truncate max-w-xs">{caseItem.description}</TableCell>
                  <TableCell>{caseItem.case_type}</TableCell>
                  <TableCell>{getPriorityBadge(caseItem.priority)}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    {getAgencyIcon(caseItem.assigned_agency)}
                    {caseItem.assigned_agency.replace('_', ' ')}
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {caseItem.latitude}, {caseItem.longitude}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleResolved(caseItem.id)}
                      className="flex items-center gap-1"
                    >
                      {caseItem.resolved ? (
                        <ToggleRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-red-500" />
                      )}
                      {caseItem.resolved ? 'Resolved' : 'Pending'}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCase(caseItem)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Case #{selectedCase?.id} Details</DialogTitle>
                        </DialogHeader>
                        {selectedCase && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-semibold flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                Location
                              </h4>
                              <p className="text-sm">
                                Lat: {selectedCase.latitude}, Lng: {selectedCase.longitude}
                              </p>
                              <div className="mt-2">
                                <iframe
                                  width="100%"
                                  height="200"
                                  style={{ border: 0 }}
                                  loading="lazy"
                                  allowFullScreen
                                  referrerPolicy="no-referrer-when-downgrade"
                                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}&q=${selectedCase.latitude},${selectedCase.longitude}&zoom=15`}
                                ></iframe>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold">Description</h4>
                              <p className="text-sm">{selectedCase.description}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold">Case Type</h4>
                              <p className="text-sm">{selectedCase.case_type}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold">Priority</h4>
                              {getPriorityBadge(selectedCase.priority)}
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold flex items-center gap-1">
                                {getAgencyIcon(selectedCase.assigned_agency)}
                                Assigned Agency
                              </h4>
                              <p className="text-sm">{selectedCase.assigned_agency.replace('_', ' ')}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold flex items-center gap-1">
                                <User className="h-4 w-4" />
                                Patient Details
                              </h4>
                              <div className="text-sm space-y-1">
                                <p><strong>Name:</strong> {selectedCase.profiles.full_name}</p>
                                <p><strong>Age:</strong> {selectedCase.profiles.age}</p>
                                <p><strong>Gender:</strong> {selectedCase.profiles.gender}</p>
                                <p><strong>Contact:</strong> {selectedCase.profiles.contact_phone}</p>
                                <p><strong>Emergency Contact:</strong> {selectedCase.profiles.emergency_name} ({selectedCase.profiles.emergency_phone})</p>
                                <p><strong>Allergies:</strong> {selectedCase.profiles.allergies.split('\r\n').join(', ')}</p>
                                <p><strong>Medical History:</strong> {selectedCase.profiles.medical_history.split('\r\n').join(', ')}</p>
                                <p><strong>Relationship:</strong> {selectedCase.profiles.relationship}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Created At
                              </h4>
                              <p className="text-sm">{new Date(selectedCase.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold">Status</h4>
                              <Badge variant={selectedCase.resolved ? 'default' : 'destructive'}>
                                {selectedCase.resolved ? 'Resolved' : 'Pending'}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}