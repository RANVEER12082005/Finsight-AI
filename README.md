---

## 🔮 Roadmap

- [x] ✅ Multi-account management
- [x] ✅ Multi-currency support (12+ currencies)
- [x] ✅ AI receipt scanner (Gemini Vision)
- [x] ✅ Finance chatbot (Gemini AI)
- [x] ✅ Budget tracking with real-time sync
- [x] ✅ Spending limits with alerts
- [x] ✅ Recurring transactions
- [x] ✅ Savings goals with AI advice
- [x] ✅ PDF export with branding
- [x] ✅ Light/Dark theme
- [x] ✅ Animated landing page (Framer Motion)
- [x] ✅ Public marketing pages (Features, Pricing, Docs)
- [ ] 🔜 Deploy to Vercel
- [ ] 🔜 Mobile responsive design
- [ ] 🔜 Email notifications (Resend)
- [ ] 🔜 Monthly email reports
- [ ] 🔜 Bank account integration
- [ ] 🔜 Investment portfolio tracker
- [ ] 🔜 Tax calculation helper
- [ ] 🔜 React Native mobile app
- [ ] 🔜 AI monthly spending predictions

---

## 📁 Key Files Reference

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Animated landing page with Framer Motion |
| `src/app/(main)/layout.tsx` | Dashboard sidebar with theme toggle |
| `src/app/(main)/dashboard/page.tsx` | Main financial dashboard |
| `src/app/(main)/transactions/page.tsx` | Transaction management + PDF export |
| `src/app/(main)/transactions/scan/page.tsx` | AI receipt scanner UI |
| `src/app/api/scan-receipt/route.ts` | Gemini Vision API handler |
| `src/app/api/chat/route.ts` | Gemini chatbot API handler |
| `src/app/api/dashboard/route.ts` | Aggregated dashboard stats |
| `src/app/api/transactions/route.ts` | Transaction CRUD + balance sync |
| `src/context/AccountContext.tsx` | Global account + currency state |
| `src/hooks/useThemeMount.ts` | Hydration-safe theme hook |
| `src/lib/db.ts` | MongoDB connection with caching |
| `src/lib/exportPDF.ts` | Branded PDF report generator |
| `src/models/` | All Mongoose data models |
| `src/middleware.ts` | Clerk auth + route protection |
| `.env.local` | API keys (never commit this!) |
| `.env.example` | Environment variable template |

---

## 👨‍💻 Author

**Ranveer Singh**
B.Tech Computer Science Engineering

---

## 🙏 Acknowledgements

| Library / Service | Purpose |
|-------------------|---------|
| [Google Gemini AI](https://ai.google.dev) | AI engine for scanning, chatbot, and insights |
| [Clerk](https://clerk.com) | Authentication and user management |
| [Next.js](https://nextjs.org) | Full-stack React framework |
| [MongoDB](https://mongodb.com) | NoSQL database |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS framework |
| [shadcn/ui](https://ui.shadcn.com) | Accessible UI component library |
| [Framer Motion](https://framer.com/motion) | Animation library |
| [Recharts](https://recharts.org) | Chart library for financial visualization |
| [jsPDF](https://github.com/parallax/jsPDF) | PDF generation |
| [Lucide React](https://lucide.dev) | Icon library |
| [next-themes](https://github.com/pacocoursey/next-themes) | Theme management |

---

<div align="center">

**⭐ If this project helped you, please give it a star on GitHub! ⭐**

> 💡 FinSight AI — Making personal finance intelligent, automated, and beautiful.

Made with ❤️ by Ranveer Singh

</div>
EOF
