"use client";

import { useState, useEffect } from "react";
import { FiArrowLeft, FiCheck, FiMessageSquare, FiMoreVertical } from "react-icons/fi";
import { getUserById, getPotentialMatches, proposeMatch, type User as APIUser } from "@/lib/api/admin";
import { toast } from "react-toastify";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface UserDetailProps {
  userId: string;
  onClose: () => void;
}

interface UserDetailData {
  id: string;
  alias: string;
  fullName: string;
  email: string;
  age: number | null;
  gender: string;
  location: string;
  verified: boolean;
  status: string;
  photos?: string[];
  // Profile attributes
  hasChildren?: boolean;
  idealMarriageTimeline?: string;
  conflictHandling?: string;
  faithImportance?: string;
  weekendActivities?: string;
  education?: string;
  openToPartnerWithChildren?: boolean;
  previouslyMarried?: boolean;
  loveLanguage?: string;
  preferOwnBackground?: boolean;
  livingSituation?: string;
  languages?: string[];
}

interface RecommendedMatch {
  userId: string;
  compatibilityScore: number;
  displayName?: string;
  fullName?: string;
  age?: number;
  gender?: string;
  location?: string;
}

export default function UserDetail({ userId, onClose }: UserDetailProps) {
  const { user: currentUser } = useAuthGuard({ allowRoles: ['admin', 'superAdmin'] });
  const [user, setUser] = useState<UserDetailData | null>(null);
  const [recommendedMatches, setRecommendedMatches] = useState<RecommendedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState("");
  const [adminNoteAuthor, setAdminNoteAuthor] = useState("");

  useEffect(() => {
    fetchUserDetails();
    fetchRecommendedMatches();
  }, [userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await getUserById(userId);
      if (response.success && response.user) {
        const userData = response.user;
        const profile = userData.profiles?.[0] || userData.profile || {};
        
        // Extract questionnaire data if available
        const questionnaireData = profile.questionnaire_data || {};
        const relationshipData = questionnaireData.relationship || {};
        const emotionalData = questionnaireData.emotional || {};
        const backgroundData = questionnaireData.background || {};
        
        // Map questionnaire answers to display values
        const mapTimeline = (value: string) => {
          if (!value) return "Not specified";
          const map: Record<string, string> = {
            "within_1_year": "Ready soon",
            "1_to_2_years": "1–2 years",
            "open_ended": "Open-ended",
            "not_sure": "Not sure yet",
          };
          return map[value] || value;
        };

        const mapConflictHandling = (value: string) => {
          if (!value) return "Not specified";
          const map: Record<string, string> = {
            "talk_it_out": "Communicator",
            "take_space": "Withdrawer",
            "avoid_it": "Avoider",
            "seek_help": "Seeker",
          };
          return map[value] || value;
        };

        const mapFaithImportance = (value: string) => {
          if (!value) return "Not specified";
          const map: Record<string, string> = {
            "very_important": "Faith-centered",
            "somewhat_important": "Faith-aware",
            "not_important": "Secular",
          };
          return map[value] || value;
        };

        const mapWeekendStyle = (value: string) => {
          if (!value) return "Not specified";
          const map: Record<string, string> = {
            "quiet_home": "Introvert",
            "socializing": "Social",
            "outdoor": "Active",
            "working": "Busy",
          };
          return map[value] || value;
        };

        const mapEducation = (value: string) => {
          if (!value) return "Not specified";
          const map: Record<string, string> = {
            "primary": "Primary",
            "secondary": "Secondary",
            "university": "University/Other",
            "other": "University/Other",
          };
          return map[value] || value;
        };

        const mapLoveLanguage = (value: string) => {
          if (!value) return "Not specified";
          const map: Record<string, string> = {
            "words_of_affirmation": "Words",
            "acts_of_service": "Acts",
            "physical_touch": "Touch",
            "quality_time": "Time",
            "gifts": "Gifts",
          };
          return map[value] || value;
        };

        const mapLivingSituation = (value: string) => {
          if (!value) return "Not specified";
          const map: Record<string, string> = {
            "alone": "Independent",
            "with_family": "Family-based",
            "with_roommates": "Communal/Other",
            "other": "Communal/Other",
          };
          return map[value] || value;
        };

        const mapLanguages = (languages: any) => {
          if (!languages) return "Not specified";
          if (Array.isArray(languages)) {
            const count = languages.length;
            if (count === 1) return "Monolingual";
            if (count === 2) return "Bilingual";
            if (count >= 3) return "Multilingual";
          }
          if (typeof languages === 'string') {
            const count = languages.split(',').length;
            if (count === 1) return "Monolingual";
            if (count === 2) return "Bilingual";
            if (count >= 3) return "Multilingual";
          }
          return "Not specified";
        };

        setUser({
          id: userData.id,
          alias: profile.display_name || userData.display_name || "Unknown",
          fullName: profile.full_name || userData.real_name || "Unknown",
          email: userData.email || "",
          age: profile.age || null,
          gender: profile.gender || "",
          location: profile.current_location || "",
          verified: userData.verified || false,
          status: userData.status || "active",
          photos: Array.isArray(profile.photos) ? profile.photos : [],
          hasChildren: profile.has_children ?? relationshipData.has_children ?? false,
          idealMarriageTimeline: mapTimeline(profile.ideal_marriage_timeline || relationshipData.ideal_marriage_timeline),
          conflictHandling: mapConflictHandling(profile.conflict_handling || relationshipData.conflict_handling),
          faithImportance: mapFaithImportance(profile.faith_importance || relationshipData.faith_importance),
          weekendActivities: mapWeekendStyle(profile.weekend_activities || relationshipData.weekend_activities),
          education: mapEducation(profile.education || backgroundData.education),
          openToPartnerWithChildren: profile.open_to_partner_with_children ?? relationshipData.open_to_partner_with_children ?? false,
          previouslyMarried: profile.previously_married ?? relationshipData.previously_married ?? false,
          loveLanguage: mapLoveLanguage(profile.love_language || relationshipData.love_language),
          preferOwnBackground: profile.prefer_own_background ?? relationshipData.prefer_own_background ?? false,
          livingSituation: mapLivingSituation(profile.living_situation || backgroundData.living_situation),
          languages: Array.isArray(profile.languages) 
            ? profile.languages 
            : (typeof profile.languages === 'string' 
              ? profile.languages.split(',').map((l: string) => l.trim()) 
              : []),
        });

        // TODO: Fetch admin notes from backend
        setAdminNotes("Ask the user to upload clear images.");
        setAdminNoteAuthor("Paulo Paul");
      } else {
        toast.error(response.error || "Failed to fetch user details");
      }
    } catch (error: any) {
      console.error("[UserDetail] Error fetching user:", error);
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedMatches = async () => {
    try {
      const response = await getPotentialMatches(userId, { limit: 10, minCompatibility: 70 });
      if (response.success && response.matches) {
        // Fetch user details for each match
        const matchesWithDetails = await Promise.all(
          response.matches.slice(0, 2).map(async (match) => {
            try {
              const userResponse = await getUserById(match.userId);
              if (userResponse.success && userResponse.user) {
                const profile = userResponse.user.profiles?.[0] || userResponse.user.profile || {};
                return {
                  userId: match.userId,
                  compatibilityScore: match.compatibilityScore,
                  displayName: profile.display_name || userResponse.user.display_name || "Unknown",
                  fullName: profile.full_name || userResponse.user.real_name || "Unknown",
                  age: profile.age || null,
                  gender: profile.gender || "",
                  location: profile.current_location || "",
                };
              }
            } catch (error) {
              console.error("[UserDetail] Error fetching match details:", error);
            }
            return {
              userId: match.userId,
              compatibilityScore: match.compatibilityScore,
            };
          })
        );
        setRecommendedMatches(matchesWithDetails);
      }
    } catch (error: any) {
      console.error("[UserDetail] Error fetching recommended matches:", error);
    }
  };

  const handleCreateMatch = async (matchUserId: string) => {
    if (!currentUser) return;
    
    try {
      const response = await proposeMatch({
        user1Id: userId,
        user2Id: matchUserId,
      });

      if (response.success) {
        toast.success("Match created successfully");
      } else {
        toast.error(response.error || "Failed to create match");
      }
    } catch (error: any) {
      console.error("[UserDetail] Error creating match:", error);
      toast.error("Failed to create match");
    }
  };

  // Map values to display labels
  const getDisplayValue = (key: string, value: any): string => {
    if (value === null || value === undefined) return "Not specified";
    
    // Special mappings
    if (key === "hasChildren") {
      return value === true ? "Has children" : "No children";
    }
    if (key === "openToPartnerWithChildren") {
      return value === true ? "Open" : "Not Open";
    }
    if (key === "previouslyMarried") {
      return value === false ? "Never married" : value === true ? "Divorced" : "Not specified";
    }
    if (key === "preferOwnBackground") {
      return value === true ? "Same culture" : value === false ? "Different culture" : "Not specified";
    }
    
    return String(value);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#702C3E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 p-4 sm:p-6">
        <button
          onClick={onClose}
          className="mb-4 flex items-center gap-2 text-[#702C3E] hover:text-[#5E2333] font-medium"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <div className="bg-[#F6E7EA] rounded-lg p-8 text-center">
          <p className="text-[#5A4A4A]">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-[#EDD4D3] p-4 sm:p-6 overflow-y-auto">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onClose}
          className="text-[#702C3E] hover:text-[#5E2333] transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-[#702C3E]">
            {user.alias}
          </h1>

          {user.verified && (
            <span className="px-2 py-0.5 text-xs rounded bg-[#702C3E] text-white">
              Verified
            </span>
          )}
        </div>
      </div>

      {/* USER CARD */}
      <div className="bg-white rounded-xl p-5 mb-6">
        <p className="font-semibold text-[#702C3E]">{user.fullName}</p>
        <p className="text-sm text-[#6B5B5B]">{user.email}</p>

        <div className="flex flex-wrap gap-2 text-sm text-[#AB574F] mt-2">
          {user.age && <span>{user.age} yrs</span>}
          {user.gender && <span>• {user.gender}</span>}
          {user.location && <span>• {user.location}</span>}
        </div>

        <div className="flex gap-3 mt-4">
          <button className="flex-1 bg-[#702C3E] text-white py-2 rounded-md hover:bg-[#5E2333] transition-colors">
            Send Message
          </button>
          <button className="flex-1 border border-[#702C3E] text-[#702C3E] py-2 rounded-md hover:bg-[#F6E7EA] transition-colors">
            More Actions
          </button>
        </div>
      </div>

      {/* RECOMMENDED MATCHES */}
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-[#702C3E] mb-4 border-b border-[#E6DADA] pb-2">
          Recommended Matches ({recommendedMatches.length})
        </h2>

        <div className="space-y-4">
          {recommendedMatches.slice(0, 2).map((match, index) => (
            <div
              key={match.userId}
              className={`${
                index % 2 === 0 ? "bg-[#F6E7EA]" : "bg-transparent"
              } border border-[#FFFFFF] rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4`}
            >
              {/* Left Section: Alias, Status, Full Name, Details */}
              <div className="flex-1 min-w-0">
                {/* Alias and Status Tag */}
                <div className="flex items-center gap-4 sm:gap-6 mb-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#702C3E]">
                    {match.displayName || "Unknown"}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium border bg-white text-[#702C3E]">
                    Unmatched
                  </span>
                </div>

                {/* Full Name */}
                {match.fullName && (
                  <p className="text-base sm:text-lg text-[#702C3E] mb-2 font-medium">
                    {match.fullName}
                  </p>
                )}

                {/* Details: Age, Gender, Location */}
                <div className="flex items-center gap-2 text-sm sm:text-base text-[#AB574F] flex-wrap">
                  {match.age && <span>{match.age} yrs</span>}
                  {match.age && <span className="text-[#AB574F]">•</span>}
                  {match.gender && <span>{match.gender}</span>}
                  {match.gender && <span className="text-[#AB574F]">•</span>}
                  {match.location && <span>{match.location}</span>}
                </div>
              </div>

              {/* Center Section: Recommended Matches */}
              <div className="flex-1 flex justify-center items-center">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-[#5A4A4A] mb-1">
                    Recommended Matches
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#702C3E]">
                    {match.compatibilityScore || 0}
                  </p>
                </div>
              </div>

              {/* Right Section: Create Match Button */}
              <div className="flex items-center">
                <button
                  onClick={() => handleCreateMatch(match.userId)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 border border-[#702C3E] rounded-lg text-[#702C3E] font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                    index % 2 === 0
                      ? "bg-[#F6E7EA] hover:bg-[#EDD4D3]"
                      : "bg-transparent hover:bg-[#F6E7EA]"
                  }`}
                >
                  Create Match
                </button>
              </div>
            </div>
          ))}
          {recommendedMatches.length === 0 && (
            <p className="text-[#5A4A4A] text-center py-4">No recommended matches found</p>
          )}
        </div>
      </div>

      {/* ABOUT */}
      <div className="bg-[#F3DADA] rounded-xl p-5 mb-6">
        <h2 className="font-semibold text-[#702C3E] mb-4">
          About {user.alias}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {[
            ["Children", getDisplayValue("hasChildren", user.hasChildren)],
            ["Marriage timeline", user.idealMarriageTimeline || "Not specified"],
            ["Conflict handling", user.conflictHandling || "Not specified"],
            ["Faith importance", user.faithImportance || "Not specified"],
            ["Weekend style", user.weekendActivities || "Not specified"],
            ["Education level", user.education || "Not specified"],
            ["Partner with children", getDisplayValue("openToPartnerWithChildren", user.openToPartnerWithChildren)],
            ["Marital history", getDisplayValue("previouslyMarried", user.previouslyMarried)],
            ["Love language", user.loveLanguage || "Not specified"],
            ["Cultural preference", getDisplayValue("preferOwnBackground", user.preferOwnBackground)],
            ["Living situation", user.livingSituation || "Not specified"],
            ["Languages spoken", user.languages && user.languages.length > 0
              ? user.languages.length === 1
                ? "Monolingual"
                : user.languages.length === 2
                ? "Bilingual"
                : "Multilingual"
              : "Not specified"],
          ].map(([label, value]) => (
            <div key={label as string}>
              <p className="text-[#9B8A8A]">{label}</p>
              <p className="text-[#702C3E] font-medium">{value}</p>
            </div>
          ))}
        </div>

        {/* IMAGES */}
        {user.photos && user.photos.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-[#702C3E] font-medium">
            {user.photos.map((photo, i) => {
              const photoName = typeof photo === 'string' 
                ? photo.split('/').pop() || `image${i + 1}.png`
                : `image${i + 1}.png`;
              return (
                <p key={i}>{photoName}</p>
              );
            })}
          </div>
        )}
      </div>

      {/* ADMIN NOTES */}
      <div className="bg-[#F3DADA] rounded-xl p-5">
        <h2 className="font-semibold text-[#702C3E] mb-2">Admin Notes</h2>
        <div className="bg-white rounded-md p-4">
          {adminNoteAuthor && (
            <p className="font-semibold text-[#702C3E]">{adminNoteAuthor}</p>
          )}
          <p className="text-sm text-[#702C3E] mt-1 font-medium">{adminNotes || "No notes yet."}</p>
        </div>
      </div>
    </div>
  );
}

