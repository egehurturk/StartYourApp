import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code2, FileCode, Boxes, Container,
  Hash, Coffee, Cog, FileJson
} from 'lucide-react';

const ProjectSetup = () => {
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTech, setSelectedTech] = useState([]);

  const technologies = [
    { name: 'Java', icon: <Coffee className="w-6 h-6" /> },
    { name: 'Python', icon: <FileCode className="w-6 h-6" /> },
    { name: 'JavaScript', icon: <FileJson className="w-6 h-6" /> },
    { name: 'HTML', icon: <Code2 className="w-6 h-6" /> },
    { name: 'C++', icon: <Hash className="w-6 h-6" /> },
    { name: 'C#', icon: <Hash className="w-6 h-6" /> },
    { name: 'Docker', icon: <Container className="w-6 h-6" /> },
    { name: 'Maven', icon: <Cog className="w-6 h-6" /> },
    { name: 'Make', icon: <Cog className="w-6 h-6" /> },
    { name: 'CMake', icon: <Boxes className="w-6 h-6" /> }
  ];

  const toggleTech = (tech: string) => {
    // @ts-ignore
    setSelectedTech(prev =>
        // @ts-ignore
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Project Setup Wizard</CardTitle>
          <CardDescription>
            Step {step} of 3: {
              step === 1 ? "Project Name" :
              step === 2 ? "Project Description" :
              "Technology Selection"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <Input
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full"
              />
              <Button
                onClick={() => setStep(2)}
                disabled={!projectName.trim()}
                className="w-full"
              >
                Next
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Textarea
                placeholder="Describe your project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-32"
              />
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!description.trim()}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {technologies.map((tech) => (
                  <div
                    key={tech.name}
                    onClick={() => toggleTech(tech.name)}
                    className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center space-y-2 transition-colors ${
                      // @ts-ignore
                      selectedTech.includes(tech.name)
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-secondary/50'
                    }`}
                  >
                    {tech.icon}
                    <span className="text-sm">{tech.name}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedTech.map(tech => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  onClick={() => console.log({
                    projectName,
                    description,
                    selectedTech
                  })}
                  disabled={selectedTech.length === 0}
                >
                  Create Project
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSetup;