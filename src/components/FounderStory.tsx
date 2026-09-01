'use client';

import React from 'react';
import { Video, Award, Plane, CheckCircle2, MessageSquare, ShieldCheck } from 'lucide-react';

export default function FounderStory() {
  return (
    <section className="py-16 md:py-24 border-t border-black/[0.06] bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#059669] text-xs font-semibold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The Human Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] tracking-tight">
            Not a Faceless Website. <br />
            <span className="text-[#e85d04]">Your Personal Friend & Engineer on the Ground in China.</span>
          </h2>
          <p className="text-[#718096] text-sm sm:text-base leading-relaxed">
            Importing machinery or electronics from China usually feels like a gamble. We built Synapse Engineering around a single promise: <strong className="text-[#1a1a1a]">personal accountability, on-ground factory visits, and live video QC before a single dollar is shipped</strong>.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="craft-card p-8 space-y-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#e85d04] flex items-center justify-center"><Video className="w-6 h-6" /></div>
            <h3 className="text-lg font-bold text-[#1a1a1a]">Live On-Site Video QC</h3>
            <p className="text-sm text-[#718096] leading-relaxed font-light">Before your goods are packed, our team in Shenzhen/Dongguan visits the production facility. We inspect tolerances, serial numbers, and film live video demonstrations so you approve exactly what ships.</p>
            <div className="pt-2 text-xs text-[#e85d04] font-medium flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#059669]" /><span>Zero mystery, zero defect guarantee</span></div>
          </div>
          <div className="craft-card p-8 space-y-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center"><Award className="w-6 h-6" /></div>
            <h3 className="text-lg font-bold text-[#1a1a1a]">Direct Manufacturer Pricing</h3>
            <p className="text-sm text-[#718096] leading-relaxed font-light">Online marketplaces like Alibaba add 20-35% trading company markups. We negotiate directly with source OEM factories in Chinese, securing true wholesale rates for single spares or container loads.</p>
            <div className="pt-2 text-xs text-[#e85d04] font-medium flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#059669]" /><span>Full transparent BOM costing</span></div>
          </div>
          <div className="craft-card p-8 space-y-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0284c7] flex items-center justify-center"><Plane className="w-6 h-6" /></div>
            <h3 className="text-lg font-bold text-[#1a1a1a]">Customs & Doorstep Delivery</h3>
            <p className="text-sm text-[#718096] leading-relaxed font-light">We handle the entire headache: export clearance in China, air express (7-10 days) or sea freight (25-35 days), customs duty in Chittagong/Dhaka, and doorstep delivery to your factory or home.</p>
            <div className="pt-2 text-xs text-[#e85d04] font-medium flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#059669]" /><span>Dhaka, Gazipur, Chittagong, Bogura</span></div>
          </div>
        </div>

        <div className="craft-card p-8 sm:p-10 border-[#1a3a5c]/20 flex flex-col md:flex-row items-center justify-between gap-8 text-left bg-gradient-to-br from-white to-[#fafaf8]">
          <div className="space-y-2">
            <div className="text-xs text-[#e85d04] font-bold uppercase tracking-wider">Direct Access</div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1a1a1a]">Have a part to source or need engineering advice?</h3>
            <p className="text-sm text-[#718096] max-w-xl">Talk directly with our on-ground team right now on WhatsApp. No automated tickets — an experienced engineer will reply within minutes.</p>
          </div>
          <a href="https://wa.me/8801886113236?text=Hi%20Synapse%20Engineering,%20I%20would%20like%20to%20discuss%20a%20project/product." target="_blank" rel="noopener noreferrer" className="px-6 py-3.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-sm flex items-center gap-2 shrink-0 shadow-lg transition-all">
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp (+880 1886-113236)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
