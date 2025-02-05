'use client';

import React, { useState, useEffect } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Github, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import Graph from '@/components/graph';
import Editor from "@monaco-editor/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface UnsavedChanges {
  [key: string]: boolean;
}

export interface LanguageInfo {
  name: string;
  extension: string[];
  monacoLanguage: string;
}

export const languageMap: LanguageInfo[] = [
  {
    name: 'JavaScript',
    extension: ['js', 'jsx', 'mjs'],
    monacoLanguage: 'javascript'  // Monaco identifier
  },
  {
    name: 'TypeScript',
    extension: ['ts', 'tsx'],
    monacoLanguage: 'typescript'
  },
  {
    name: 'Python',
    extension: ['py', 'pyw', 'pyc'],
    monacoLanguage: 'python'
  },
  {
    name: 'HTML',
    extension: ['html', 'htm'],
    monacoLanguage: 'html'
  },
  {
    name: 'CSS',
    extension: ['css', 'scss', 'sass', 'less'],
    monacoLanguage: 'css'
  },
  {
    name: 'JSON',
    extension: ['json'],
    monacoLanguage: 'json'
  },
  {
    name: 'Markdown',
    extension: ['md', 'markdown'],
    monacoLanguage: 'markdown'
  },
  {
    name: 'Docker',
    extension: ['dockerfile'],
    monacoLanguage: 'dockerfile'
  },
  {
    name: 'YAML',
    extension: ['yml', 'yaml'],
    monacoLanguage: 'yaml'
  },
  {
    name: 'XML',
    extension: ['xml'],
    monacoLanguage: 'xml'
  },
  {
    name: 'SQL',
    extension: ['sql'],
    monacoLanguage: 'sql'
  },
  {
    name: 'Plain Text',
    extension: ['txt'],
    monacoLanguage: 'plaintext'
  }
];

export const getMonacoLanguage = (filename: string): string => {
  const langInfo = getFileLanguage(filename);
  return langInfo.monacoLanguage;
};

export const getFileLanguage = (filename: string): LanguageInfo => {
  // Handle special cases first
  if (filename.toLowerCase() === 'dockerfile') {
    return languageMap.find(lang => lang.name === 'Docker') || languageMap[11]; // fallback to Plain Text
  }

  const extension = filename.split('.').pop()?.toLowerCase() || '';

  // If no extension, return Plain Text
  if (!extension) return languageMap[11];

  // Find the language that matches the extension
  const language = languageMap.find(lang =>
    lang.extension.includes(extension)
  );

  // Return the found language or Plain Text as fallback
  return language || languageMap[11];
};

const ProjectScaffolder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('diagram');
  const [activeFile, setActiveFile] = useState<string>('README.md');
  const [fileContent, setFileContent] = useState<string>('# My Project. This is a sample README file.');
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['src']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingClose, setPendingClose] = useState(false);

  const [unsavedChanges, setUnsavedChanges] = useState<UnsavedChanges>({});

  const projectStructure: ProjectStructure = {
    'README.md': { type: 'file', content: '# My Project' },
    'src': {
      type: 'folder',
      children: {
        'manage.py': { type: 'file', content: 'print("Hello")' },
        'requirements.txt': { type: 'file', content: 'django==4.2\npsycopg2-binary==2.9.6' },
        'app': {
          type: 'folder',
          children: {
            'project.tsx': {type: 'file', content: "const [isModalOpen, setIsModalOpen] = useState(false);\nconst [unsavedChanges, setUnsavedChanges] = useState<UnsavedChanges>({});"}
          }
        }
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

  // File click handler in your renderTree function
  const handleFileClick = (filename: string, content: string) => {
    setActiveFile(filename);
    setFileContent(content);
    setActiveTab('editor');
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
            onClick={() => handleFileClick(fullPath, item.content)}
          >
            <File size={16} className="text-gray-500" />
            <span>{name}</span>
          </div>
        );
      }
    });
  };

  const handleGithubExport = async (): Promise<void> => {
    // Implement GitHub export
    console.log('Exporting to GitHub');
  };

  const handleDownload = async (): Promise<void> => {
    // Implement ZIP download
    console.log('Downloading as ZIP');
  };

  const handleEditorChange = (value: string | undefined, event: any) => {
    setFileContent(value || '');
    setUnsavedChanges(prev => ({
      ...prev,
      [activeFile]: true
    }));
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSaveFile();
      }

      // Handle CMD/CTRL + W
      if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
        e.preventDefault(); // Prevent browser tab from closing

        // Only handle if we're in editor tab
        if (activeTab === 'editor') {
          // Create a synthetic mouse event to pass to handleCloseAttempt
          const syntheticEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          }) as unknown as React.MouseEvent;

          handleCloseAttempt(syntheticEvent);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fileContent, activeFile]);

  const handleCloseAttempt = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (unsavedChanges[activeFile]) {
        setPendingClose(true);
        setIsModalOpen(true);
      } else {
        setActiveTab('diagram');
      }
    };

  // Handle save
  const handleSaveFile = async () => {
    console.log('Saving file:', activeFile, fileContent);
    setUnsavedChanges(prev => ({
      ...prev,
      [activeFile]: false
    }));
  };

  const UnsavedChangesModal = () => (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unsaved Changes</DialogTitle>
          <DialogDescription>
            This file has unsaved changes. Do you want to close it anyway?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 mt-4">
          <Button
            variant="secondary"
            onClick={() => {
              setIsModalOpen(false);
              setPendingClose(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setUnsavedChanges(prev => ({
                ...prev,
                [activeFile]: false
              }));
              setActiveTab('diagram');
              setIsModalOpen(false);
              setPendingClose(false);
            }}
          >
            Close without saving
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const EditorTab = () => {
    const hasUnsavedChanges = unsavedChanges[activeFile];

    return (
        <div className="flex items-center">
          <div className={`
            flex items-center gap-2 
            px-3 py-1.5 
            bg-white
            text-gray-700
            border border-gray-200
            border-b-0
            rounded-t-md
            shadow-sm
            relative
            ml-4
            group
            hover:bg-gray-50
          `}>
            <File size={14} className="text-gray-500"/>
            <span className="text-sm font-medium flex items-center gap-1">
          {activeFile.split('/').pop()}
              <div className="relative ml-2 w-2 h-2">
              {/* Unsaved changes indicator */}
                {hasUnsavedChanges && (
                    <span className="
                      absolute
                      top-1/2
                      left-1/2
                      -translate-x-1/2
                      -translate-y-1/2
                      w-2
                      h-2
                      rounded-full
                      bg-gray-400
                      group-hover:opacity-0
                      transition-opacity
                    "/>
                )}
                {/* Close button - hidden by default, visible on hover when there are unsaved changes */}
            {hasUnsavedChanges && (
              <button
                className="
                  absolute
                  top-1/2
                  left-1/2
                  -translate-x-1/2
                  -translate-y-1/2
                  text-gray-400
                  hover:text-gray-700
                  hover:bg-gray-200
                  rounded-sm
                  w-4
                  h-4
                  flex
                  items-center
                  justify-center
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  text-xs
                  font-medium
                "
                onClick={handleCloseAttempt}
              >
                ×
              </button>
            )}
              </div>
        </span>

            {/* Close button - only shown on hover when there are NO unsaved changes */}
            {!hasUnsavedChanges && (
                <button
                    className="
                ml-2
                text-gray-400
                hover:text-gray-700
                hover:bg-gray-200
                rounded-sm
                p-0.5
                opacity-0
                group-hover:opacity-100
                transition-opacity
              "
              onClick={handleCloseAttempt}
            >
              ×
            </button>
          )}
            <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-blue-500"></div>
          </div>
        </div>
    );
  }

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
                {activeTab === 'editor' && <EditorTab/>}
                <Editor
                    height="600px"
                    language={getMonacoLanguage(activeFile)}
                    theme="one-dark"
                    value={fileContent}
                    options={{
                      inlineSuggest: true,
                      fontSize: "16px",
                      formatOnType: true,
                      autoClosingBrackets: true,
                      minimap: {scale: 0.5}
                    }}
                    onChange={handleEditorChange}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <UnsavedChangesModal />
    </div>
  );
};

export default ProjectScaffolder;
