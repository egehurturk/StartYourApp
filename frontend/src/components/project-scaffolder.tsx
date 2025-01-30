'use client';

import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Github, Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import Graph from '@/components/graph';

interface FileItem {
  type: 'file';
  content: string;
}

interface FolderItem {
  type: 'folder';
  children: ProjectStructure;
}

interface ProjectStructure {
  [key: string]: FileItem | FolderItem;
}

interface CodeEditorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

interface Node {
  id: string;
  x: number;
  y: number;
  color: string;
  label: string;
  fillColor: string;
}

// Simple code editor component
const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange }) => (
  <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
    <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
      <div className="flex space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
    </div>
    <Textarea
      value={value}
      onChange={onChange}
      className="w-full h-[calc(100%-2.5rem)] bg-gray-900 text-gray-100 font-mono p-4 border-0 resize-none focus:ring-0"
      style={{
        minHeight: '300px',
        caretColor: 'white'
      }}
    />
  </div>
);

const ProjectScaffolder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('diagram');
  const [activeFile, setActiveFile] = useState<string>('README.md');
  const [fileContent, setFileContent] = useState<string>('# My Project\n\nThis is a sample README file.');
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['src']);

  // State for draggable nodes
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'frontend', x: 200, y: 150, color: '#3B82F6', label: 'Frontend', fillColor: '#60A5FA' },
    { id: 'backend', x: 400, y: 300, color: '#059669', label: 'Backend', fillColor: '#34D399' },
    { id: 'database', x: 600, y: 450, color: '#7C3AED', label: 'Database', fillColor: '#A78BFA' }
  ]);

  // State for tracking dragging
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  const projectStructure: ProjectStructure = {
    'README.md': { type: 'file', content: '# My Project' },
    'src': {
      type: 'folder',
      children: {
        'manage.py': { type: 'file', content: 'print("Hello")' },
        'requirements.txt': { type: 'file', content: 'django==4.2\npsycopg2-binary==2.9.6' }
      }
    }
  };


  const toggleFolder = (path: string): void => {
    setExpandedFolders(prev =>
      prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  const renderTree = (structure: ProjectStructure, path: string = ''): React.ReactNode => {
    return Object.entries(structure).map(([name, item]) => {
      const fullPath = path ? `${path}/${name}` : name;

      if (item.type === 'folder') {
        const isExpanded = expandedFolders.includes(fullPath);
        return (
          <div key={fullPath}>
            <div
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
              onClick={() => toggleFolder(fullPath)}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Folder size={16} className="text-blue-500" />
              <span>{name}</span>
            </div>
            {isExpanded && (
              <div className="ml-4">
                {renderTree(item.children, fullPath)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div
            key={fullPath}
            className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer ${
              activeFile === fullPath ? 'bg-blue-100' : ''
            }`}
            onClick={() => {
              setActiveFile(fullPath);
              setFileContent(item.content);
              setActiveTab('editor');
            }}
          >
            <File size={16} className="text-gray-500" />
            <span>{name}</span>
          </div>
        );
      }
    });
  };

  const handleSave = async (): Promise<void> => {
    // Implement save functionality
    console.log('Saving file:', activeFile);
  };

  const handleGithubExport = async (): Promise<void> => {
    // Implement GitHub export
    console.log('Exporting to GitHub');
  };

  const handleDownload = async (): Promise<void> => {
    // Implement ZIP download
    console.log('Downloading as ZIP');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Code Explorer */}
        <div className="w-64 bg-white border-r border-gray-200">
          <div className="p-4 font-semibold">Project Explorer</div>
          <div className="p-2">
            {renderTree(projectStructure)}
          </div>
        </div>

        {/* Dashboard/Editor Area */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <div className="border-b border-gray-200 bg-white p-2">
              <div className="flex justify-between items-center px-4">
                <TabsList>
                  <TabsTrigger value="diagram">Architecture Diagram</TabsTrigger>
                  <TabsTrigger value="editor">Code Editor</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleGithubExport}>
                    <Github className="w-4 h-4 mr-2" />
                    Export to GitHub
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download ZIP
                  </Button>
                </div>
              </div>
            </div>

            <TabsContent value="diagram" className="flex-1 p-4">
              <Card className="w-full h-full bg-white">
                <Graph/>
              </Card>
            </TabsContent>

            <TabsContent value="editor" className="flex-1">
              <div className="h-full p-4">
                <CodeEditor
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProjectScaffolder;