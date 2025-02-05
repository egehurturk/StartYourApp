'use client';

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe2,
  Lock,
  Users,
  Archive,
  Trash2,
  CheckCircle2,
  Plus,
  MoreVertical,
  Download,
  ChevronDown,
  ArrowUpDown,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data - replace with your actual data fetching logic
const projects = [
  {
    id: 1,
    name: "Project Alpha",
    description: "A comprehensive project management system",
    visibility: "public",
    created_at: "2025-01-15T10:00:00",
    updated_at: "2025-02-01T15:30:00",
    status: "active"
  },
  {
    id: 2,
    name: "Project Beta",
    description: "Internal analytics dashboard",
    visibility: "private",
    created_at: "2025-01-20T09:00:00",
    updated_at: "2025-01-28T11:20:00",
    status: "archived"
  },
  {
    id: 3,
    name: "Project Gamma",
    description: "Collaborative workspace platform",
    visibility: "shared",
    created_at: "2025-01-25T14:00:00",
    updated_at: "2025-02-04T16:45:00",
    status: "active"
  }
];

const ITEMS_PER_PAGE = 10;

const ProjectsDashboard = () => {
  const [selectedProjects, setSelectedProjects] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <Globe2 className="w-4 h-4 text-green-500" />;
      case 'private':
        return <Lock className="w-4 h-4 text-red-500" />;
      case 'shared':
        return <Users className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 shadow-none">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case 'archived':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 shadow-none">
            <Archive className="w-3 h-3 mr-1" />
            Archived
          </Badge>
        );
      case 'deleted':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100 shadow-none">
            <Trash2 className="w-3 h-3 mr-1" />
            Deleted
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleProjectSelection = (projectId: unknown) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(projectId)) {
      newSelected.delete(projectId);
    } else {
      newSelected.add(projectId);
    }
    setSelectedProjects(newSelected);
  };

  const toggleAllProjects = () => {
    if (selectedProjects.size === projects.length) {
      setSelectedProjects(new Set());
    } else {
      setSelectedProjects(new Set(projects.map(p => p.id)));
    }
  };

  const handleSort = (field: React.SetStateAction<string>) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleProjectAction = (projectId: number, action: string) => {
    console.log(`Performing ${action} on project ${projectId}`);
    // Implement your action handlers here
  };

  return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor all your projects in one place
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2"/>
            New Project
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
            </SelectContent>
          </Select>

          <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by visibility"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Visibility</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="shared">Shared</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                        checked={selectedProjects.size === projects.length}
                        onCheckedChange={toggleAllProjects}
                    />
                  </TableHead>
                  <TableHead className="w-[250px]">
                    <Button variant="ghost" onClick={() => handleSort('name')} className="flex items-center">
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                  </TableHead>
                  <TableHead className="w-[300px]">Description</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('visibility')} className="flex items-center">
                      Visibility
                      <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('created_at')} className="flex items-center">
                      Created
                      <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('updated_at')} className="flex items-center">
                      Last Updated
                      <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                    <TableRow
                        key={project.id}
                        className="hover:bg-muted/50"
                    >
                      <TableCell>
                        <Checkbox
                            checked={selectedProjects.has(project.id)}
                            onCheckedChange={() => toggleProjectSelection(project.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {project.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getVisibilityIcon(project.visibility)}
                          <span className="capitalize">{project.visibility}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(project.created_at)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(project.updated_at)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4"/>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => handleProjectAction(project.id, 'download')}
                                className="text-muted-600"
                            >
                              <Download className="mr-2 h-4 w-4"/>
                              Download ZIP
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem
                                onClick={() => handleProjectAction(project.id, 'archive')}
                                className="text-yellow-600"
                            >
                              <Archive className="mr-2 h-4 w-4"/>
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem
                                onClick={() => handleProjectAction(project.id, 'delete')}
                                className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4"/>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            {selectedProjects.size} of {projects.length} project(s) selected
          </div>
          <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {currentPage}
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage * ITEMS_PER_PAGE >= projects.length}
            >
              Next
            </Button>
          </div>
        </div>

        <div
            className="mt-6 border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-gray-300 transition-colors"
            onClick={() => console.log('Create new project')}
        >
          <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
            <Plus className="h-6 w-6 text-gray-600"/>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Create a new project</h3>
          <p className="text-sm text-gray-500 mt-1">Start building something amazing</p>
        </div>
      </div>
  );
};

export default ProjectsDashboard;