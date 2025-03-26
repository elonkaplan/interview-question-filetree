import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from "lucide-react";

import { FC } from "react";
import { INode } from "./file-tree-viewer";

interface Props {
  node: INode;
  prevPath: string | null;
  getData: (path: string, nodeName?: string) => Promise<void>;
  setIsOpened: (path: string, isOpened: boolean) => void;
}
export const FileTreeItem: FC<Props> = ({
  node,
  prevPath,
  getData,
  setIsOpened,
}) => {
  if (!node.children)
    return (
      <li>
        <div className="flex gap-1">
          {node.type === "file" ? (
            <FileIcon className="h-5 w-5" />
          ) : (
            <FolderIcon className="h-5 w-5" />
          )}

          {node.name}
        </div>
      </li>
    );

  return (
    <li>
      <div className="flex gap-1">
        {Object.values(node.children).some((item) => !!item) &&
        node.isOpened ? (
          <>
            <ChevronDownIcon
              className="h-5 w-5"
              onClick={() =>
                setIsOpened(
                  prevPath ? `${prevPath}/${node.id}` : `${node.id}`,
                  false
                )
              }
            />
            <FolderOpenIcon className="h-5 w-5" />
          </>
        ) : (
          <>
            <ChevronRightIcon
              className="h-5 w-5"
              onClick={async () => {
                if (!node.children) return;
                for (const childName of Object.keys(node.children)) {
                  await getData(
                    prevPath
                      ? `${prevPath}/${node.id}/${childName}`
                      : `${node.id}/${childName}`,
                    childName
                  );
                }

                setIsOpened(
                  prevPath ? `${prevPath}/${node.id}` : `${node.id}`,
                  true
                );
              }}
            />
            <FolderIcon className="h-5 w-5" />
          </>
        )}

        {node.name}
      </div>

      {node.children && node.isOpened && (
        <ul
          style={{
            paddingLeft: `${
              (prevPath ? prevPath.split("/")?.length : 1) * 24
            }px`,
          }}
        >
          {Object.values(node.children).map((item) => {
            if (!item) return null;

            return (
              <FileTreeItem
                prevPath={prevPath ? `${prevPath}/${node.id}` : node.name}
                getData={getData}
                node={item}
                key={item.id}
                setIsOpened={setIsOpened}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
};
