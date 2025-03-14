import React from "react";
import { Button } from "../ui/button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";

export const CTA = () => {
  return (
    <div className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80')] bg-cover bg-center opacity-10"></div>
      </div>
      <div className="relative max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to boost your productivity?
        </h2>
        <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied users who have transformed their project
          management experience
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold">
            <RegisterLink>Start for Free</RegisterLink>
          </button>
          <button className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold">
            Watch Demo
          </button>
        </div>
      </div>
    </div>
  );
};