"use client"

import NavigationBar from "@/components/navigation/navbar";
import { Button } from "@/components/ui/button"; // Ensure you have a Button component
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <section className="flex h-screen bg-gray-900 text-white p-4" 
    style={{
      backgroundImage: 'url("/assets/background.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      
}}>
  
    {/* I added this for opacity overalay - Alix */} 
    {/* Cause of not clickable components */}
    {/* <div className="absolute inset-0 bg-black opacity-10"></div> */}

      {/* Left Sidebar */}
      <div className="w-2/6 p-4 flex flex-col items-end">
        <div className="w-full flex flex-col items-center">
          <img src="/assets/6.png" alt="Logo" className="mb-4 w-50 h-48" />

          <div className="flex flex-col items-center p-4 rounded-lg border-2 border-yellow-500">
            <Button
              onClick={() => router.push('/dashboard/create')}
              className="bg-yellow-500 text-white p-2 rounded-md mb-4 w-32 hover:bg-gray-500 hover:bg-opacity-20 transition-colors duration-300"
            >
              Create
            </Button>
            <div className="flex items-center bg-gray-700 p-2 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.9 14.32a8 8 0 111.414-1.414l4.285 4.284a1 1 0 01-1.414 1.415l-4.285-4.285zM14 8a6 6 0 11-12 0 6 6 0 0112 0z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent text-white outline-none"
              />
            </div>
          </div>
        </div>
      </div>


      {/* Middle Section */}
      <div className="w-3/6 p-4 max-h-screen overflow-auto no-scrollbar bg-opacity-50 rounded-lg border-2 border-yellow-500">
        {children}
      </div>

      {/* Right Sidebar */}
      <div className="w-2/6 p-4 flex flex-col items-center">
        <NavigationBar />
      </div>
      
    </section>
  );
}