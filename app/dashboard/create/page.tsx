"use client";

// import Chip from "@/components/chip/Chip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreateForm from "@/components/events/createForm";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { useAppSelector } from "@/lib/hooks";
import { FaCalendarAlt, FaImage, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

const chips = ["JavaScript", "TypeScript", "React", "Next.js"];

const handleChipClick = (chip: string) => {
  alert(`Chip clicked: ${chip}`);
};

export default function Create() {
//   const { userDetails } = useAppSelector((state) => state.user);

  return (
    <div className="flex h-[42rem] flex-col items-center justify-between">  
      <div className="flex justify-center mt-4">
        {/* {chips.map((chip, index) => (
          <Chip
            key={index}
            label={chip}
            onClick={() => handleChipClick(chip)}
          />
        ))} */}
      </div>

      <Separator className="my-4" />

      <div className="flex-1 w-full p-4 rounded-lg">
        {/* Upper Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-14 w-14">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            {/* <div className="pl-4">
              <p className="text-white">Username: {userDetails?.userName}</p>
              <FaUser className="text-2xl text-yellow-500 mt-2" />
            </div> */}
          </div>

          <a href="#" className="text-lg text-white">
            . . .
          </a>
        </div>

        {/* Separator */}
        <hr className="border-t-1 border-yellow-500 mt-2 mb-4" />

        {/* Event Form */}
        <div className="flex flex-col space-y-4">
          {/* <input
            type="text"
            placeholder="Title of your Event"
            className="w-full p-2 bg-transparent text-white rounded-md placeholder-gray-400"
          /> */}

          {/* <Separator /> */}

          {/* <textarea
            placeholder="Write your incoming event"
            className="w-full p-2 bg-transparent text-white rounded-md placeholder-gray-400"
            rows={3}
          /> */}

          {/* Date and Location Inputs */}
          {/* <div className="flex space-x-2">
            <div className="flex items-center space-x-2 flex-1">
              <FaCalendarAlt className="text-yellow-500" />
              <input
                type="text"
                placeholder="Start Date"
                className="w-full p-2 bg-transparent text-white rounded-md placeholder-gray-400 border-2 border-yellow-500"
              />
            </div>
            <div className="flex items-center space-x-2 flex-1">
              <FaCalendarAlt className="text-yellow-500" />
              <input
                type="text"
                placeholder="End Date"
                className="w-full p-2 bg-transparent text-white rounded-md placeholder-gray-400 border-2 border-yellow-500"
              />
            </div>
          </div> */}

          {/* <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-yellow-500" />
            <input
              type="text"
              placeholder="Location"
              className="w-full p-2 bg-transparent text-white rounded-md placeholder-gray-400 border-2 border-yellow-500"
            />
          </div> */}

          <CreateForm />

          {/* <Separator /> */}

          {/* Image Upload Button */}
          {/* <div className="flex items-center space-x-2">
            <button className="flex-1 text-white rounded-md">
              <FaImage className="text-yellow-500 size-8" />
            </button>

            <button className="flex justify-center items-end w-1/3 p-2 mt-5 bg-yellow-500 text-white font-bold rounded-3xl mx-full shadow-black shadow-md">
              Post
            </button>
          </div> */}

          {/* Post Button */}
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="flex-1 min-h-96 w-full">
        <Card className="">
          <CardHeader className="flex items-center">
            <CardTitle className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Create an Event
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center flex-col">
            <CreateForm />{" "}
          </CardContent>
        </Card>
      </div> */
}