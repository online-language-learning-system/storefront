import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
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

  if (loading) return <p className="text-center mt-10">Đang tải thông tin...</p>;
  if (!profile) return <p className="text-center mt-10">Không có thông tin người dùng.</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-20 px-6">
        <Typography variant="h2" className="text-center font-bold mb-12">
          Thông tin cá nhân
        </Typography>

        <Card className="max-w-xl mx-auto shadow-lg rounded-xl p-6 bg-white">
          <CardBody className="space-y-4">
            <div>
              <Typography variant="small" className="text-gray-500">ID</Typography>
              <Typography>{profile.id}</Typography>
            </div>
            <div>
              <Typography variant="small" className="text-gray-500">Tên đăng nhập</Typography>
              <Typography>{profile.username}</Typography>
            </div>
            <div>
              <Typography variant="small" className="text-gray-500">Họ và tên</Typography>
              <Typography>{profile.firstName} {profile.lastName}</Typography>
            </div>
            <div>
              <Typography variant="small" className="text-gray-500">Email</Typography>
              <Typography>{profile.email}</Typography>
            </div>

            <Button color="red" className="mt-4 w-full rounded-full">Chỉnh sửa thông tin</Button>
          </CardBody>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
