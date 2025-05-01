import { FormSubmitLoading } from "@/components/ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useGetSingleModuleDataQuery } from "@/redux/features/module/module.api";
import { Link, useNavigate, useParams } from "react-router-dom";

import { deleteVideoFunction } from "@/functions/video.functions";
import { useDeleteVideoMutation } from "@/redux/features/video/video.api";
import { userRoleConts } from "@/utils/constants";
import { GetUserRole } from "@/utils/sharedFunction";
import MuxPlayer from "@mux/mux-player-react";

type TVideo = {
  _id: string;
  title: string;
  videoUrl: string;
};

const InstructorModule = () => {
  const userRole = GetUserRole();

  let content = null;
  const navigate = useNavigate();

  const { moduleId } = useParams();

  if (!moduleId) {
    throw new Error("Something went wrong !!!");
  }

  const {
    data: moduleData,
    isLoading: moduleDataLoading,
    refetch: moduleDataRefetch,
  } = useGetSingleModuleDataQuery(moduleId, {
    skip: !moduleId,
    refetchOnMountOrArgChange: true,
  });

  const [deleteVideo, { isLoading: videoDeletingLoading }] =
    useDeleteVideoMutation();

  // ! for deletig video
  const handleDeleteVideo = async (videoData: TVideo) => {
    const payload = {
      videoId: videoData?._id,
      moduleId,
    };

    const result = await deleteVideoFunction(payload, deleteVideo);

    if (result?.data?.success) {
      moduleDataRefetch();
    }
  };

  // console.log(moduleData?.data?.videos);
  // console.log(moduleData?.data?.videos?.length);
  // console.log(moduleData?.data?.course?.published);

  // ! for no video data
  if (!moduleData?.data?.videos?.length) {
    content = (
      <p className=" mt-4 text-lg text-red-600 font-semibold ">
        No Video found for this module !!!
      </p>
    );
  } else {
    content = (
      <div className="videoDetails">
        <Accordion type="single" collapsible className="w-full">
          {moduleData?.data?.videos &&
            moduleData?.data?.videos?.map((videoData: TVideo) => (
              <AccordionItem value={videoData?._id}>
                <AccordionTrigger> {videoData?.title} : </AccordionTrigger>
                <AccordionContent>
                  <div className="videoPreviewContainer mt-4">
                    <MuxPlayer
                      playbackId=""
                      streamType="on-demand"
                      src={videoData.videoUrl}
                      className="rounded-md"
                      autoPlay={false}
                      style={{ width: "100%", height: "26rem" }}
                      metadata={{
                        video_title: `${videoData?.title}`,
                      }}
                      forwardSeekOffset={5}
                      backwardSeekOffset={5}
                    />
                  </div>

                  <div className="btnSection   py-4 ">
                    {userRole === userRoleConts?.instructor && (
                      <div className="btnGroup flex   gap-x-3">
                        <Link
                          to={`/dashboard/instructor/update-video/${videoData?._id}`}
                        >
                          <Button className=" bg-green-700/95 hover:bg-green-800/95 ">
                            Update Video
                          </Button>
                        </Link>

                        {/*  */}
                        <Button
                          disabled={moduleData?.data?.course?.published}
                          onClick={() => handleDeleteVideo(videoData)}
                          className="  bg-red-600 hover:bg-red-700 "
                        >
                          Delete Video
                        </Button>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    );
  }

  return (
    <>
      {(videoDeletingLoading || moduleDataLoading) && <FormSubmitLoading />}

      <div className="InstructorModuleContainer">
        <div className="InstructorModuleWrapper bg-gray-100 border border-gray-300  shadow rounded-md p-4 ">
          <h3 className="brand text-2xl font-medium mb-6 underline  ">
            Module Detail :
          </h3>

          {/* module detail body  */}
          <div className="moduleDetailBody flex justify-between  ">
            <div className="bodyLeft text-lg flex flex-col gap-y-2">
              {/* course name  */}
              <p className="courseName">
                <span className=" font-bold ">Course name : </span>{" "}
                {moduleData?.data?.course?.name}
              </p>

              {/* course published */}
              <p className="coursePublished">
                <span className={` font-bold  `}>Course Published : </span>{" "}
                <span
                  className={` ${
                    moduleData?.data?.course?.published
                      ? "text-green-600 "
                      : "text-red-600 "
                  } `}
                >
                  {moduleData?.data?.course?.published
                    ? "Published "
                    : "Unpublished "}
                </span>
              </p>

              {/* course category  */}
              <p className="courseCategory">
                <span className=" font-bold ">Course category : </span>
                {moduleData?.data?.course?.category}
              </p>

              {/* module name  */}
              <p className="moduleName">
                <span className=" font-bold ">Module name : </span>
                {moduleData?.data?.title}
              </p>
            </div>

            {/* add , update button section  */}
            <div className="rightBtnSection">
              {userRole === userRoleConts?.instructor && (
                <div className=" btnSection  flex justify-between  gap-x-3 ">
                  <Button
                    disabled={moduleData?.data?.course?.published}
                    className=" bg-prime100 hover:bg-prime200 "
                    onClick={() =>
                      navigate(
                        `/dashboard/instructor/update-module/${moduleId}`
                      )
                    }
                  >
                    Update Module
                  </Button>

                  {/*  */}
                  <Button
                    disabled={moduleData?.data?.course?.published}
                    className=" bg-green-700/95 hover:bg-green-800/95 "
                    onClick={() =>
                      navigate(`/dashboard/instructor/add-video/${moduleId}`)
                    }
                  >
                    Add New Video
                  </Button>

                  {/*  */}
                </div>
              )}
            </div>
          </div>

          {/* video section  */}
          <div className="videoSection mt-10 ">
            <h3 className="brand text-2xl font-medium  underline  ">
              Videos :
            </h3>

            {content}
          </div>

          {/*  */}
        </div>
      </div>
    </>
  );
};

export default InstructorModule;
