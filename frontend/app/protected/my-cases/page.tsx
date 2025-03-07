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
import { MapPin, Siren, Clock, User } from 'lucide-react'
import { useGetUserCases } from '@/utils/hooks/user'

// Define the Case type based on your dummy data
interface EmergencyCase {
  latitude: number
  longitude: number
  description: string
  case_type: string
  priority: 'high' | 'medium' | 'low'
  geo_point: string
  assigned_agency: 'ambulance' | 'fire_department' | 'police'
  user_id: string
  resolved: boolean
  created_at: string // Assuming timestampz is a string like "2023-10-01T12:00:00Z"
}

// Dummy data (replace with your API fetch logic)
const dummyCases: EmergencyCase[] = [
  {
    latitude: 9.9816,
    longitude: 76.2999,
    description: "A car accident near MG Road, one person injured.",
    case_type: "car accident",
    priority: "high",
    geo_point: "POINT(76.2999 9.9816)",
    assigned_agency: "ambulance",
    user_id: "d653cac4-fc69-44ac-8266-c3f87d3b1e26",
    resolved: false,
    created_at: "2025-03-07T10:00:00Z",
  },
  {
    latitude: 10.0162,
    longitude: 76.3411,
    description: "House fire reported, smoke visible.",
    case_type: "fire",
    priority: "high",
    geo_point: "POINT(76.3411 10.0162)",
    assigned_agency: "fire_department",
    user_id: "e1234abc-5678-90de-f123-456789abcdef",
    resolved: false,
    created_at: "2025-03-07T11:15:00Z",
  },
  {
    latitude: 9.9391,
    longitude: 76.2603,
    description: "Suspicious activity near park.",
    case_type: "security",
    priority: "medium",
    geo_point: "POINT(76.2603 9.9391)",
    assigned_agency: "police",
    user_id: "a9876xyz-5432-10ab-c987-654321fedcba",
    resolved: true,
    created_at: "2025-03-06T09:30:00Z",
  },
]

export default function CasesPage() {
  const [selectedCase, setSelectedCase] = useState<EmergencyCase | null>(null)
  const {data:dummyCases}=useGetUserCases()
  console.log("🚀 ~ CasesPage ~ dummyCases:", dummyCases)

  // Priority badge styling
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500 text-white">High</Badge>
      case 'medium':
        return <Badge className="bg-yellow-500 text-black">Medium</Badge>
      case 'low':
        return <Badge className="bg-green-500 text-white">Low</Badge>
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
            <Siren className="h-6 w-6 text-red-500" />
            Emergency Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
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
              {dummyCases?.map((caseItem) => (
                <TableRow key={caseItem.user_id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{caseItem.description}</TableCell>
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
                    <Badge variant={caseItem.resolved ? 'default' : 'destructive'}>
                      {caseItem.resolved ? 'Resolved' : 'Pending'}
                    </Badge>
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
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Case Details</DialogTitle>
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
                              <p className="text-sm text-muted-foreground">
                                Geo: {selectedCase.geo_point}
                              </p>
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
                                User ID
                              </h4>
                              <p className="text-sm text-muted-foreground">{selectedCase.user_id}</p>
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