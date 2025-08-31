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
import { electionAPI, apiHelpers } from "@/api/api";
import { useToast } from "@/hooks/use-toast";

interface Candidate {
  id: string;
  name: string;
  party?: string;
  position?: string;
  election_id: string;
  status?: string;
  votes?: number;
  photo?: string;
  election?: any;
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get all elections first, then get candidates for each
        const electionsResponse = await electionAPI.getAllElections();
        const allCandidates: Candidate[] = [];
        
        // For each election, get its candidates
        for (const election of electionsResponse.data) {
          try {
            const candidatesResponse = await electionAPI.getCandidatesByElection(election.id);
            const electionCandidates = candidatesResponse.data.map((candidate: any) => ({
              ...apiHelpers.formatCandidate(candidate),
              election: election
            }));
            allCandidates.push(...electionCandidates);
          } catch (error) {
            console.error(`Error fetching candidates for election ${election.id}:`, error);
          }
        }
        
        setCandidates(allCandidates);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        toast({
          title: "Error",
          description: "Failed to fetch candidates. Please try again.",
          variant: "destructive",
        });
        // Fallback to empty array if API fails
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleCreateCandidate = async (data: any) => {
    try {
      const response = await electionAPI.createCandidate(data);
      const newCandidate = apiHelpers.formatCandidate(response.data);
      setCandidates(prev => [...prev, newCandidate]);
      setShowAddForm(false);
      toast({
        title: "Success",
        description: "Candidate created successfully",
      });
    } catch (error) {
      console.error("Error creating candidate:", error);
      toast({
        title: "Error",
        description: "Failed to create candidate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCandidate = async (id: string) => {
    try {
      await electionAPI.deleteCandidate(id);
      setCandidates(prev => prev.filter(candidate => candidate.id !== id));
      toast({
        title: "Success",
        description: "Candidate deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast({
        title: "Error",
        description: "Failed to delete candidate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate?.party?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate?.position?.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Calculate stats
  const totalCandidates = candidates.length;
  const approvedCandidates = candidates.filter(c => c.status === "Approved").length;
  const pendingCandidates = candidates.filter(c => c.status === "Pending").length;
  const totalVotes = candidates.reduce((sum, c) => sum + (c.votes || 0), 0);

  if (loading) {
    return (
      <RoleLayout
        role="admin"
        sidebarItems={adminSidebarItems}
        currentPath="/admin/candidates"
      >
        <div className="p-6 space-y-6">
          <div className="text-center">Loading candidates...</div>
        </div>
      </RoleLayout>
    );
  }

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
                  <p className="text-2xl font-bold">{totalCandidates}</p>
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
                  <p className="text-2xl font-bold">{approvedCandidates}</p>
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
                  <p className="text-2xl font-bold">{pendingCandidates}</p>
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
                  <p className="text-2xl font-bold">{totalVotes.toLocaleString()}</p>
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
                    <TableCell>{candidate.party || "N/A"}</TableCell>
                    <TableCell>{candidate.position || "N/A"}</TableCell>
                    <TableCell>{candidate.election?.title || candidate.election_id}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(candidate.status || "Pending")}>
                        {candidate.status || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>{(candidate.votes || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteCandidate(candidate.id)}
                        >
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
            onSubmit={handleCreateCandidate}
          />
        )}
      </div>
    </RoleLayout>
  );
}
