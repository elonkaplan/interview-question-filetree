import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { FileTreeItem } from "./file-tree-item";
// API CALL TO USE
import { readINode } from "./api/read-inode";

export interface INode {
  id: string;
  type: "directory" | "file";
  name: string;
  isOpened: boolean;
  children?: Record<string, null | INode>; // file or directory ids
}

export function FileTreeViewer() {
  // Here is your API call to use
  // It returns a promise containing the directory based on the directory ID
  // console.log(readINode());

  const [fileTree, setFileTree] = useState<INode | null>(null);

  const getData = useCallback(async (path: string, nodeName?: string) => {
    const res = await readINode(nodeName);

    const newNode: INode = JSON.parse(JSON.stringify(res));

    if (res.type === "directory" && res.children) {
      newNode.children = {};

      for (const name of res.children) {
        newNode.children[name] = null;
      }
    }

    const splitted = path.split("/");

    setFileTree((prev) => {
      if (!prev) return { ...newNode, isOpened: true };
      const newFileTree = JSON.parse(JSON.stringify(prev));
      let tempTree = newFileTree;

      for (let i = 0; i < splitted.length; i++) {
        if (i === 0) continue;
        const name = splitted[i];

        if (i === splitted.length - 1) {
          tempTree.children[name] = {
            ...newNode,
            isOpened: true,
          };
        } else {
          tempTree = tempTree.children[name];
        }
      }

      return newFileTree;
    });
  }, []);

  useEffect(() => {
    getData("root");
  }, [getData]);

  const setIsOpened = useCallback((path: string, isOpened: boolean) => {
    const splitted = path.split("/");

    setFileTree((prev) => {
      if (!prev) return prev;

      const newFileTree = JSON.parse(JSON.stringify(prev));
      let tempTree = newFileTree;

      for (let i = 0; i < splitted.length; i++) {
        if (i === 0) {
          if (splitted.length === 1) {
            tempTree.isOpened = isOpened;
          }
          continue;
        }

        const name = splitted[i];

        if (i === splitted.length - 1) {
          tempTree.children[name].isOpened = isOpened;
        } else {
          tempTree = tempTree.children[name];
        }
      }

      return newFileTree;
    });
  }, []);

  return (
    <div className="bg-white rounded p-6 space-y-6">
      <div className="grid">
        <h1 className="text-lg font-medium">File Tree Viewer</h1>
        <p className="max-w-md text-gray-500">
          Create a file tree viewer component that displays a directory
          structure. The component should be able to expand and collapse
          folders, and should display the file and folder icons.
        </p>
      </div>

      <div className="grid">
        <span className="text-base font-medium">Icons</span>
        <p className="text-gray-500">
          For your convenience, here are the icons you can use
        </p>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center justify-center border rounded p-3">
            <FileIcon className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-center border rounded p-3">
            <FolderIcon className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-center border rounded p-3">
            <FolderOpenIcon className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-center border rounded p-3">
            <ChevronRightIcon className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-center border rounded p-3">
            <ChevronDownIcon className="h-5 w-5" />
          </div>
        </div>
        {fileTree && (
          <FileTreeItem
            node={fileTree}
            prevPath={null}
            getData={getData}
            setIsOpened={setIsOpened}
          />
        )}
      </div>

      <p className="max-w-md border-l-[3px] border-l-gray-300 pl-4 py-1 text-gray-500">
        When you're ready, delete the contents of the
        <br />
        <code className="bg-gray-600 text-gray-100 font-medium px-1 py-0.5 rounded text-sm">
          ./src/file-tree-viewer.tsx
        </code>{" "}
        file and start building.
      </p>
    </div>
  );
}
