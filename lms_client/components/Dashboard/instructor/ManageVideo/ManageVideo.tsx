"use client";

import TableDataLoading from "@/components/shared/TableLoading";
import GenericTableComponent from "@/components/shared/table/GenericTableComponent";
import { useFetchData } from "@/hooks/useApi";
import { ManageVideoColumns } from "./ManageVideoColumns";

const ManageVideo = () => {
  const { data: videoData, isLoading } = useFetchData<any>(
    ["all-videos"],
    "/video/module-video",
  );

  let content = null;

  if (isLoading) {
    content = <TableDataLoading />;
  } else if (videoData?.data?.length) {
    content = (
      <div className="Tablecontainer mx-auto py-10">
        <GenericTableComponent
          columns={ManageVideoColumns}
          data={videoData.data}
          showToolbar={false}
        />
      </div>
    );
  } else {
    content = (
      <p className="mt-4 text-lg text-red-600 font-semibold">
        No videos found.
      </p>
    );
  }

  return (
    <div className="ManageVideoContainer">
      <div className="ManageVideoWrapper bg-gray-100/90 border border-gray-300 shadow rounded-md p-3">
        <h3 className="brand text-2xl font-medium mb-4">Manage Videos</h3>
        {content}
      </div>
    </div>
  );
};

export default ManageVideo;
