'use client';

import React from 'react';
import { Video, ShieldCheck, PhoneCall, Plane, Anchor, Award, CheckCircle2, MessageSquare } from 'lucide-react';

export default function FounderStory() {
  return (
    <section className="py-16 md:py-24 border-t border-white/[0.06] bg-[#0c0e14] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Story Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The Human Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Not a Faceless Website. <br />
            <span className="text-amber-400">Your Personal Friend & Engineer on the Ground in China.</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Importing machinery or electronics from China usually feels like a gamble. We built Synapse Engineering around a single promise: <strong>personal accountability, on-ground factory visits, and live video QC before a single dollar is shipped</strong>.
          </p>
        </div>

        {/* 3 Pillar Human Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: Video QC */}
          <div className="craft-card p-8 space-y-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Live On-Site Video QC</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              Before your goods are packed, our team in Shenzhen/Dongguan visits the production facility. We inspect tolerances, serial numbers, and film live video demonstrations so you approve exactly what ships.
            </p>
            <div className="pt-2 text-xs text-amber-400/80 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero mystery, zero defect guarantee</span>
            </div>
          </div>

          {/* Card 2: Direct Factory Floor Rates */}
          <div className="craft-card p-8 space-y-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Direct Manufacturer Pricing</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              Online marketplaces like Alibaba add 20-35% trading company markups. We negotiate directly with source OEM factories in Chinese, securing true wholesale rates for single spares or container loads.
            </p>
            <div className="pt-2 text-xs text-amber-400/80 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full transparent BOM costing</span>
            </div>
          </div>

          {/* Card 3: Turnkey Air & Sea Logistics */}
          <div className="craft-card p-8 space-y-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Plane className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Customs & Doorstep Delivery</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              We handle the entire headache: export clearance in China, air express (7-10 days) or sea freight (25-35 days), customs duty in Chittagong/Dhaka, and doorstep delivery to your factory or home.
            </p>
            <div className="pt-2 text-xs text-amber-400/80 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Dhaka, Gazipur, Chittagong, Bogura</span>
            </div>
          </div>
        </div>

        {/* Founder Direct Connect Strip */}
        <div className="craft-card p-8 sm:p-10 border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-8 text-left bg-gradient-to-br from-[#12151c] to-[#181d26]">
          <div className="space-y-2">
            <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Direct Access</div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Have a part to source or need engineering advice?
            </h3>
            <p className="text-sm text-slate-400 max-w-xl">
              Talk directly with our on-ground team right now on WhatsApp. No automated tickets — an experienced engineer will reply within minutes.
            </p>
          </div>

          <a
            href="https://wa.me/8801886113236?text=Hi%20Synapse%20Engineering,%20I%20would%20like%20to%20discuss%20a%20project/product."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center gap-2 shrink-0 shadow-lg transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp (+880 1886-113236)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
