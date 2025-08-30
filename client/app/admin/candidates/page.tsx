"use client";

import { useEffect, useState } from "react";
import { RoleLayout } from "@/components/layout/role-layout";
import { adminSidebarItems } from "@/lib/admin-navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CandidateForm } from "@/components/admin/candidate-form";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  Award,
  FileText,
} from "lucide-react";

const mockcandidates = [
  {
    id: 1,
    name: "Alice Johnson",
    party: "Democratic Party",
    position: "Mayor",
    election: "City Council Election",
    status: "Approved",
    votes: 1247,
    photo: "/professional-woman-diverse.png",
  },
  {
    id: 2,
    name: "Robert Smith",
    party: "Republican Party",
    position: "Council Member",
    election: "City Council Election",
    status: "Pending",
    votes: 892,
    photo: "/professional-man.png",
  },
  {
    id: 3,
    name: "Maria Garcia",
    party: "Independent",
    position: "School Board",
    election: "School Board Election",
    status: "Approved",
    votes: 456,
    photo: "/professional-woman-diverse.png",
  },
];

export default function CandidatesPage() {
  interface Candidate {
    id: number;
    name: string;
    party: string;
    position: string;
    election: string;
    status: string;
    votes: number;
    photo: string;
  }
  
  const [mockCandidates, setMockCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch("/api/candidates");
        // const data = await response.json();
        // setCandidates(data);
        setMockCandidates(mockcandidates);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    fetchData();
  }, []);

  const filteredCandidates = mockCandidates.filter(
    (candidate) =>
      candidate?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate?.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate?.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <RoleLayout
      role="admin"
      sidebarItems={adminSidebarItems}
      currentPath="/admin/candidates"
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Candidate Management
            </h1>
            <p className="text-muted-foreground">
              Manage election candidates and their qualifications
            </p>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-chart-1" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Candidates
                  </p>
                  <p className="text-2xl font-bold">18</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-chart-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-chart-4" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pending Review
                  </p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-chart-2" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Votes</p>
                  <p className="text-2xl font-bold">2,595</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Candidates Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Candidates</CardTitle>
                <CardDescription>
                  Manage candidate registrations and approvals
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Election</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Votes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={candidate.photo || "/placeholder.svg"}
                          alt={candidate.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-medium">{candidate.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{candidate.party}</TableCell>
                    <TableCell>{candidate.position}</TableCell>
                    <TableCell>{candidate.election}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(candidate.status)}>
                        {candidate.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{candidate.votes.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add Candidate Form */}
        {showAddForm && (
          <CandidateForm
            onClose={() => setShowAddForm(false)}
            onSubmit={(data) => {
              console.log("Candidate added:", data);
              setShowAddForm(false);
            }}
          />
        )}
      </div>
    </RoleLayout>
  );
}
