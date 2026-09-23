export interface AiCardResult {
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  actionText: string;
  actionRoute: string;
  image?: string;
}

export interface AiAnswerResponse {
  answer: string;
  cardResult?: AiCardResult;
  sourceDocuments: string[];
  suggestedFollowups: string[];
}

export const aiService = {
  /**
   * Answers natural language questions using LifeVault data context
   */
  async answerQuestion(question: string, dataContext: any): Promise<AiAnswerResponse> {
    const q = question.toLowerCase().trim();

    // 1. Travel & Trips queries
    if (q.includes('travel') || q.includes('trip') || q.includes('goa') || q.includes('manali') || q.includes('where did i travel')) {
      if (q.includes('goa')) {
        return {
          answer: "You recently saved a 5-day trip to Goa (June 12–17, 2026). You logged 24 memories, including a Palolem beach sunset, scuba diving at Grand Island, and scooty rides in Anjuna.",
          cardResult: {
            title: 'Goa Coastal Getaway',
            subtitle: 'June 12–17, 2026',
            badge: '24 Memories',
            description: 'Resort stay at Palolem Beach. Scuba diving at Grand Island, visit to Aguada Fort and Anjuna beach cafes.',
            actionText: 'View Trip',
            actionRoute: '/travel',
            image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800'
          },
          sourceDocuments: ['Goa Coastal Getaway Trip', 'Goa Trip Checklist Note'],
          suggestedFollowups: ['What were my Goa expenses?', 'Show my Manali memories', 'When is my next trip?']
        };
      }

      if (q.includes('manali')) {
        return {
          answer: "I found 18 memories related to your Manali trip (July 05–10, 2026). Highlights include trekking through Solang Valley, Atal Tunnel, and Old Manali cafes.",
          cardResult: {
            title: 'Manali Himalayan Trek',
            subtitle: 'July 05–10, 2026',
            badge: '18 Memories',
            description: 'Mountain trek through Old Manali cafes, Atal Tunnel, and Solang valley.',
            actionText: 'View Trip',
            actionRoute: '/travel',
            image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800'
          },
          sourceDocuments: ['Manali Himalayan Trek', 'Solang Valley Audio Log'],
          suggestedFollowups: ['Show my Goa memories', 'What documents are expiring?']
        };
      }

      return {
        answer: "You recently saved trips to Goa and Manali:\n1. **Goa Coastal Getaway** (June 12–17, 2026 — 24 memories)\n2. **Manali Himalayan Trek** (July 05–10, 2026 — 18 memories)\n3. **Hyderabad Cultural Heritage** (Multiple visits — 32 memories)",
        cardResult: {
          title: 'Goa Coastal Getaway',
          subtitle: 'June 12–17, 2026',
          badge: '24 Memories',
          description: 'Resort stay at Palolem Beach with 24 saved photos & scuba logs.',
          actionText: 'View Trip',
          actionRoute: '/travel',
          image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800'
        },
        sourceDocuments: ['Goa Coastal Getaway', 'Manali Himalayan Trek', 'Hyderabad Cultural Heritage'],
        suggestedFollowups: ['Show my Manali memories', 'What documents are expiring?', 'What did I save about my project?']
      };
    }

    // 2. Document & Expiry queries
    if (q.includes('insurance') || q.includes('passport') || q.includes('pan') || q.includes('expire') || q.includes('expiring') || q.includes('document')) {
      if (q.includes('insurance')) {
        return {
          answer: "Your Health Insurance policy is scheduled to expire in 32 days (Oct 09, 2026). Coverage amount: ₹15,000,000 under Star Health Policy.",
          cardResult: {
            title: 'Health Insurance Policy',
            subtitle: 'Expires in 32 days (Oct 09, 2026)',
            badge: 'Urgent Attention',
            description: 'Star Health Policy #SHP-908123-2026 stored safely in Secure Vault.',
            actionText: 'Open Vault',
            actionRoute: '/vault'
          },
          sourceDocuments: ['Star_Health_Policy_2026.pdf', 'Secure Vault Insurance Index'],
          suggestedFollowups: ['When does my passport expire?', 'When does my PAN card expire?', 'List all identity documents']
        };
      }

      if (q.includes('passport')) {
        return {
          answer: "Your International Passport (`Z8394019`) expires in 2 years (May 09, 2027). It is stored under AES-256 encryption in your Secure Vault.",
          cardResult: {
            title: 'International Passport',
            subtitle: 'Expires May 09, 2027',
            badge: 'Protected',
            description: 'Official Passport Scan PDF stored in Identity Documents category.',
            actionText: 'Open Vault',
            actionRoute: '/vault'
          },
          sourceDocuments: ['Passport_Scan_Official.pdf', 'Identity Documents Vault'],
          suggestedFollowups: ['Find my PAN card', 'When does my insurance expire?']
        };
      }

      return {
        answer: "Here are your document expiry statuses:\n- **Health Insurance**: Expires in 32 days\n- **PAN Card**: Expires in 8 months\n- **Passport**: Expires in 2 years (May 09, 2027)",
        cardResult: {
          title: 'PAN Card — Govt of India',
          subtitle: 'Expires in 8 months',
          badge: 'Identity',
          description: 'PAN Card verified copy registered under Vishnu Sharma.',
          actionText: 'Open Vault',
          actionRoute: '/vault'
        },
        sourceDocuments: ['Star_Health_Policy.pdf', 'PAN_Card_Verified.pdf', 'Passport_Scan.pdf'],
        suggestedFollowups: ['Show my insurance document', 'Show my passport']
      };
    }

    // 3. Project & Notes queries
    if (q.includes('project') || q.includes('college') || q.includes('saved')) {
      return {
        answer: "You saved details regarding 'LifeVault Architecture Specs' on Sept 1, 2026, and logged a 'Mini Project Review' timeline milestone on Sept 2, 2026. Key tech listed: React, TypeScript, Tailwind CSS, Framer Motion, and Supabase.",
        cardResult: {
          title: 'Mini Project Review Milestone',
          subtitle: 'September 2026',
          badge: 'Project',
          description: 'Successfully presented LifeVault architecture to faculty and reviewers.',
          actionText: 'View Timeline',
          actionRoute: '/timeline',
          image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
        },
        sourceDocuments: ['LifeVault Architecture Notes', 'Mini Project Review Milestone'],
        suggestedFollowups: ['Show my recent memories', 'Where did I travel recently?']
      };
    }

    // Default intelligent response fallback
    return {
      answer: `I searched your Second Brain for "${question}". You have 6 protected documents, 3 trip logs, 4 timeline milestones, and active voice notes stored safely in LifeVault.`,
      sourceDocuments: ['LifeVault Global Index'],
      suggestedFollowups: ['Where did I travel recently?', 'What documents are expiring?', 'Show my recent memories']
    };
  }
};
