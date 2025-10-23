import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { getUserProfile } from "@/api/profileApi";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        console.log("Profile data:", data);
        setProfile(data);
      } catch (err) {
        console.error("Lỗi khi lấy profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen bg-[#910c4e]/10 flex flex-col">
        <div className="container mx-auto py-20 px-6 animate-pulse">
          <Typography
            variant="h2"
            className="text-center font-bold mb-12 bg-gray-300 text-transparent rounded-md h-10 w-64 mx-auto"
          >
            &nbsp;
          </Typography>

          <Card className="max-w-xl mx-auto shadow-lg rounded-xl p-6 bg-white">
            <CardBody className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Khi không có profile
  if (!profile)
    return (
      <p className="text-center mt-10 text-gray-500">
        Không có thông tin người dùng.
      </p>
    );

 
  return (
    <div className="min-h-screen bg-[#910c4e]/10 flex flex-col">
      <div className="container mx-auto py-20 px-6">
        <Typography variant="h2" className="text-center font-bold mb-12 text-[#910c4e]">
          Thông tin cá nhân
        </Typography>
        <Card className="max-w-xl mx-auto shadow-lg rounded-xl p-6 bg-white transition-all duration-300 hover:shadow-2xl">
          <CardBody className="space-y-5">
            <div>
              <Typography variant="small" className="text-gray-500">
                Tên đăng nhập
              </Typography>
              <Typography className="text-gray-800 font-medium">
                {profile.username}
              </Typography>
            </div>
            <div>
              <Typography variant="small" className="text-gray-500">
                Họ và tên
              </Typography>
              <Typography className="text-gray-800 font-medium">
                {profile.firstName} {profile.lastName}
              </Typography>
            </div>
            <div>
              <Typography variant="small" className="text-gray-500">
                Email
              </Typography>
              <Typography className="text-gray-800 font-medium">
                {profile.email}
              </Typography>
            </div>
          </CardBody>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
