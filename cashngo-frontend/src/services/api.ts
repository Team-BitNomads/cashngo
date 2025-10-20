import axios from "axios";
import type { Gig, UserProfile, Quiz, Badge, SignupPayload } from "../types";

// This is the base URL for your backend server.
// You will get this from Ayo, the backend developer.
const API_BASE_URL = "http://localhost:5000/api";

// We create a single, configured instance of axios to use throughout the app.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor to automatically add the JWT token to the headers of every request.
 * This is crucial for authenticated endpoints.
 */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // We will implement auth token storage later
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fetches the list of available gigs.
 * The backend is responsible for setting the `is_locked` flag based on the user's skills.
 * Endpoint: GET /api/gigs
 */
export const fetchGigs = async (): Promise<Gig[]> => {
  try {
    const response = await apiClient.get("/gigs");
    return response.data;
  } catch (error) {
    console.error("Error fetching gigs:", error);
    console.log("Backend not ready for gigs, using fallback mock data.");
    // Fallback data to keep the UI functional
    return [
      { id: "1", title: "Basic Data Entry", price: 5.0, is_locked: false },
      {
        id: "2",
        title: "Social Media Copywriting",
        price: 15.0,
        is_locked: false,
      },
      {
        id: "3",
        title: "Advanced Excel Charting",
        price: 25.0,
        is_locked: true,
        required_skill: "Advanced Excel",
      },
    ];
  }
};

/**
 * Fetches the profile data for the currently authenticated user.
 * Endpoint: GET /api/users/profile
 */
export const fetchUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await apiClient.get("/users/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    console.log("Backend not ready for profile, using fallback mock data.");
    // Fallback data for the profile page
    return {
      name: "Sadiq",
      major: "Business Administration",
      current_balance: 12.5,
      badges: [
        {
          id: "badge1",
          name: "Social Media Basics",
          icon_url: "/icons/social.png",
        },
      ],
      onboardingComplete: true,
      skill_level: "Intermediate",
    };
  }
};

/**
 * Triggers the AI service to generate a skill-gap quiz for the user.
 * Endpoint: POST /api/skills/generate-quiz
 */
export const generateQuiz = async (): Promise<Quiz> => {
  try {
    const response = await apiClient.post("/skills/generate-quiz");
    return response.data;
  } catch (error) {
    console.error("Error generating quiz:", error);
    console.log("AI service not ready, using fallback mock quiz.");
    // R1 Mitigation Strategy: return a pre-cached quiz object
    return {
      quiz_id: "quiz_excel_123",
      skill_name: "Advanced Excel Charting",
      questions: [
        {
          text: "Which chart type is best for showing trends over time?",
          options: ["Pie Chart", "Bar Chart", "Line Chart", "Scatter Plot"],
          correct_answer_index: 2,
        },
        {
          text: "What is the keyboard shortcut to create a new chart from selected data?",
          options: ["F11", "F5", "Ctrl+C", "Alt+F1"],
          correct_answer_index: 0,
        },
        {
          text: "Which feature allows you to filter, sort, and display data from a table dynamically?",
          options: [
            "VLOOKUP",
            "PivotTable",
            "Data Validation",
            "Conditional Formatting",
          ],
          correct_answer_index: 1,
        },
      ],
    };
  }
};

/**
 * Submits the user's quiz answers to the backend for verification.
 * The backend checks the answers and, if correct, issues a new badge.
 * Endpoint: POST /api/quizzes/submit
 */
export const submitQuiz = async (
  quiz_id: string,
  answers: number[]
): Promise<{ success: boolean; new_badge: Badge | null }> => {
  try {
    const response = await apiClient.post("/quizzes/submit", {
      quiz_id,
      answers,
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting quiz:", error);
    console.log(
      "Backend not ready for quiz submission, using fallback mock success response."
    );
    // Mock a successful response for the demo
    return {
      success: true,
      new_badge: {
        id: "badge_excel_adv",
        name: "Advanced Excel Charting",
        icon_url: "/icons/excel.png",
      },
    };
  }
};

export const loginUser = async (
  username: string,
  password: string
): Promise<{ token: string; user: UserProfile }> => {
  console.log("Attempting login for:", { username, password });
  // --- REAL API CALL (for when backend is ready) ---
  // const response = await apiClient.post('/auth/login', { username, password });
  // return response.data;

  // --- MOCK API RESPONSE (for hackathon) ---
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // For the student who has already onboarded
      if (username === "sadiq" && password === "password123") {
        resolve({
          token: "fake-jwt-token-for-sadiq-12345",
          user: {
            name: "Sadiq",
            major: "Computer Science",
            current_balance: 84.5,
            skill_level: "Intermediate",
            badges: [],
            onboardingComplete: true, // <-- Add this flag
          },
        });
      }
      // NEW: For the employer who has already onboarded
      else if (username === "employer" && password === "password123") {
        resolve({
          token: "fake-jwt-token-for-employer-67890",
          user: {
            name: "Ayo (Employer)",
            major: "Employer",
            current_balance: 0,
            skill_level: "Expert",
            badges: [],
            onboardingComplete: true, // <-- Add this flag
          },
        });
      } else {
        reject(new Error("Invalid username or password."));
      }
    }, 1500);
  });
};

export const signupUser = async (
  payload: SignupPayload
): Promise<{ token: string; user: UserProfile }> => {
  console.log("Attempting signup with payload:", payload);

  // --- REAL API ENDPOINT (from PRD) ---
  // When the backend is ready, you will uncomment this.
  /*
  try {
    const response = await apiClient.post('/users/signup', payload);
    return response.data;
  } catch (error) {
    console.error("Signup API failed:", error);
    throw new Error('Could not create account.');
  }
  */

  // --- MOCK API RESPONSE ---
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a potential error (e.g., username taken)
      if (payload.username === "existinguser") {
        reject(new Error("Username is already taken."));
        return;
      }

      // Simulate a successful signup
      resolve({
        token: `new-fake-jwt-for-${payload.username}`,
        user: {
          name: payload.fullName,
          major:
            payload.role === "worker"
              ? payload.status || "Not specified"
              : "Employer",
          current_balance: 0,
          skill_level: "Beginner", // All new users start as beginners
          badges: [],
          onboardingComplete: false,
        },
      });
    }, 1500); // Simulate a 1.5-second network delay
  });
};
