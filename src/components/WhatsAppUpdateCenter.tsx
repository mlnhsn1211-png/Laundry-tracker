import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  BellRing,
} from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';
import { OrderStatus } from '../types';
import {
  formatRupiah,
  buildWhatsAppLink,
  buildCustomerInquiryMessage,
  STATUS_DETAILS,
} from '../utils/formatters';

const PRESET_STAFF_NOTES = [
  'Pakaian sedang dicuci higienis dengan formula anti-bakteri & pelembut premium.',
  'Proses pengeringan suhu terkontrol telah selesai, lanjut tahap setrika uap.',
  'Semua pakaian sudah selesai disetrika uap, harum, dan dipacking sealed bag rapi.',
  'Ditemukan noda membandel pada pakaian, tim kami memberikan perawatan pre-wash ekstra gratis.',
  'Pesanan Anda sudah 100% siap! Silakan sebutkan kode pickup di counter untuk ambil tanpa antre.',
];

export const WhatsAppUpdateCenter: React.FC = () => {
  const {
    currentOrder,
    orders,
    selectOrder,
    sendWhatsAppCustomUpdate,
    simulateBotReply,
  } = useLaundry();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    currentOrder ? currentOrder.id : orders[0]?.id || ''
  );
  const [customNote, setCustomNote] = useState<string>(PRESET_STAFF_NOTES[0]);
  const [newStatus, setNewStatus] = useState<OrderStatus>('WASHING');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [botChatInput, setBotChatInput] = useState<string>('');
  const [botChatMessages, setBotChatMessages] = useState<
    Array<{ sender: 'user' | 'bot'; text: string; time: string }>
  >([
    {
      sender: 'bot',
      text: 'Halo! Saya CleanTrack AI Laundry Bot. Ketik nomor nota Anda (contoh: #LDR-10293) untuk mengecek status cucian terkini secara otomatis!',
      time: '10:00',
    },
  ]);

  const activeOrder = orders.find((o) => o.id === selectedOrderId) || currentOrder || orders[0];

  const handleSendStaffUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;

    sendWhatsAppCustomUpdate(
      activeOrder.id,
      customNote.trim(),
      newStatus,
      activeOrder.customerPhone
    );

    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 3000);
  };

  const handleSimulateBotCheck = () => {
    if (!activeOrder) return;
    simulateBotReply(activeOrder);

    // Also append to local visual chat
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setBotChatMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text: `Cek status ${activeOrder.orderNumber}`,
        time: nowTime,
      },
      {
        sender: 'bot',
        text: `Halo ${activeOrder.customerName}! Pesanan ${activeOrder.orderNumber} saat ini berstatus *${STATUS_DETAILS[activeOrder.status]?.label}*. Estimasi selesai: ${activeOrder.estimatedReadyAt}. Kode pickup Anda: ${activeOrder.pickupCode}.`,
        time: nowTime,
      },
    ]);
  };

  const handleSendCustomBotCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!botChatInput.trim()) return;

    const query = botChatInput.trim().toUpperCase();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let botResponse = `Maaf, saya tidak mengenali perintah tersebut. Anda bisa ketik nomor nota seperti #LDR-10293 atau 'STATUS'.`;

    const matched = orders.find(
      (o) =>
        o.orderNumber.toUpperCase().includes(query.replace('#', '')) ||
        o.pickupCode === query
    );

    if (matched) {
      botResponse = `✅ Ditemukan! Pesanan *${matched.orderNumber}* (${matched.customerName}): Status *${STATUS_DETAILS[matched.status]?.label}*. Total: ${formatRupiah(matched.totalPrice)} (${matched.paymentStatus}). Kode Ambil: *${matched.pickupCode}*.`;
    } else if (query.includes('LOKASI') || query.includes('CABANG')) {
      botResponse = `📍 Outlet CleanTrack Central Hub: Jl. Surya Kencana No. 42, Kebayoran, Jakarta Selatan. Buka setiap hari 07:00 – 21:00 WIB.`;
    } else if (query.includes('BIAYA') || query.includes('HARGA')) {
      botResponse = `💰 Tarif CleanTrack: Cuci Lipat Reguler Rp15.000/kg (24 jam), Express Rush Rp25.000/kg (4 jam), Bedcover Rp45.000/set.`;
    }

    setBotChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: botChatInput.trim(), time: nowTime },
      { sender: 'bot', text: botResponse, time: nowTime },
    ]);

    setBotChatInput('');
  };

  const customerInquiryLink = activeOrder
    ? buildWhatsAppLink(
        '081234567890',
        buildCustomerInquiryMessage(activeOrder.orderNumber, activeOrder.customerName)
      )
    : '';

  return (
    <div
      className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      id="whatsapp-update-center"
    >
      {/* Header */}
      <div className="bg-emerald-600 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-700">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-2 shadow-inner">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Interactive WhatsApp Updates</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            WhatsApp Laundry Updates & Status Bot
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            Real-time status updates via WhatsApp. Dispatch progress notices, send custom staff care remarks, or inquire via the automated CleanTrack Bot.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-center">
            <span className="text-[10px] text-emerald-100 uppercase font-mono block">Status Update Channel</span>
            <span className="font-mono text-sm font-bold text-white flex items-center gap-1.5 justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              Verified WhatsApp Bot
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Staff WhatsApp Dispatcher & Progress Updater */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                1. Select Order to Update
              </label>
              <span className="text-xs font-mono text-slate-500">
                Active: {activeOrder?.orderNumber}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {orders.slice(0, 6).map((ord) => (
                <button
                  key={ord.id}
                  type="button"
                  onClick={() => {
                    setSelectedOrderId(ord.id);
                    selectOrder(ord);
                    setNewStatus(ord.status);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                    activeOrder?.id === ord.id
                      ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 font-semibold'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="font-mono font-bold text-slate-900 block">{ord.orderNumber}</span>
                  <span className="text-[11px] text-slate-500 truncate block">{ord.customerName}</span>
                  <span className="text-[10px] font-mono text-emerald-700 mt-0.5 block">
                    {STATUS_DETAILS[ord.status]?.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form to dispatch update with custom remarks */}
          <form onSubmit={handleSendStaffUpdate} className="space-y-4 pt-2 border-t border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Update Wash Stage
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="WASHING">Washing (Pencucian)</option>
                  <option value="DRYING">Drying (Pengeringan)</option>
                  <option value="IRONING">Ironing & Packing (Setrika Uap)</option>
                  <option value="READY">Ready for Pickup (Siap Ambil)</option>
                  <option value="DELAYED">Delayed (Penanganan Tambahan)</option>
                  <option value="PICKED_UP">Picked Up (Selesai Serah Terima)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Target Customer WhatsApp
                </label>
                <input
                  type="text"
                  value={activeOrder?.customerPhone || ''}
                  readOnly
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-700"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
                Quick Remark Presets
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_STAFF_NOTES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomNote(preset)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors text-left truncate max-w-xs cursor-pointer ${
                      customNote === preset
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-semibold'
                        : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Preset {idx + 1}: {preset.slice(0, 32)}...
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
                Custom WhatsApp Update Message Note
              </label>
              <textarea
                rows={3}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Tuliskan catatan khusus atau informasi kondisi pakaian..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="submit"
                className="flex-1 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
                id="btn-dispatch-whatsapp-update"
              >
                <Send className="w-4 h-4" />
                <span>Kirim WhatsApp Update ke Pelanggan</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateBotCheck}
                className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>Simulate Bot Status Reply</span>
              </button>
            </div>

            {updateSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  WhatsApp update berhasil dikirim untuk order <strong>{activeOrder?.orderNumber}</strong>! Notifikasi real-time aktif.
                </span>
              </div>
            )}
          </form>

          {/* Quick Customer Inquiry Button */}
          {customerInquiryLink && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 block">Ingin tanya status langsung dari HP Anda?</span>
                <span className="text-slate-500 text-[11px]">
                  Buka WhatsApp dengan pesan tanya status otomatis ke CleanTrack
                </span>
              </div>
              <a
                href={customerInquiryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Chat WA Bot</span>
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Interactive WhatsApp Bot Simulator */}
        <div className="lg:col-span-5 flex flex-col h-[520px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
          {/* Mock WhatsApp Chat Header */}
          <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">CleanTrack WhatsApp Bot</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <span className="text-[10px] text-emerald-400 font-normal">Online • Automated Status Support</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setBotChatMessages([
                  {
                    sender: 'bot',
                    text: 'Halo! Saya CleanTrack AI Laundry Bot. Ketik nomor nota Anda (contoh: #LDR-10293) untuk mengecek status cucian terkini secara otomatis!',
                    time: '10:00',
                  },
                ])
              }
              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
              title="Reset Chat"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0b141a]">
            {botChatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#005c4b] text-white rounded-tr-none'
                      : 'bg-[#202c33] text-slate-200 rounded-tl-none border border-slate-700/50'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="text-[9px] text-slate-400 block text-right mt-1 font-mono">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Command Chips */}
          <div className="bg-[#111b21] px-3 py-2 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              type="button"
              onClick={() => {
                if (activeOrder) setBotChatInput(`Cek ${activeOrder.orderNumber}`);
              }}
              className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 hover:text-white shrink-0 font-mono"
            >
              Cek {activeOrder?.orderNumber}
            </button>
            <button
              type="button"
              onClick={() => setBotChatInput('LOKASI OUTLET')}
              className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 hover:text-white shrink-0"
            >
              Lokasi
            </button>
            <button
              type="button"
              onClick={() => setBotChatInput('DAFTAR BIAYA')}
              className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 hover:text-white shrink-0"
            >
              Tarif
            </button>
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendCustomBotCommand} className="bg-[#202c33] p-2.5 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ketik nomor nota atau perintah..."
              value={botChatInput}
              onChange={(e) => setBotChatInput(e.target.value)}
              className="flex-1 bg-[#2a3942] text-white placeholder:text-slate-400 text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shrink-0 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
