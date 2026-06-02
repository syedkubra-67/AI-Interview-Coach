const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
// Fallback to a placeholder key if environment variable is not defined to avoid server crash on startup
const apiKey = process.env.GEMINI_API_KEY || 'MOCK_GEMINI_KEY';
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Checks if Gemini API is properly configured with a real API key.
 * If not, fallback to simulated mock responses for smooth local development.
 */
const isMockMode = () => {
  return !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MOCK_GEMINI_KEY';
};

/**
 * Helper to generate 10 interview questions
 */
exports.generateQuestions = async (jobRole, difficulty) => {
  if (isMockMode()) {
    console.warn("Running in Gemini Mock Mode: Generating mock questions.");
    return Array.from({ length: 10 }, (_, i) => ({
      questionId: i + 1,
      questionText: `Mock ${difficulty} question for a ${jobRole} role: Question ${i + 1}.`,
      category: i < 6 ? 'Technical' : i < 8 ? 'Behavioral' : 'HR'
    }));
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a professional HR director and tech lead. Generate exactly 10 interview questions for a candidate applying for the role of a ${jobRole}. The difficulty level is ${difficulty}.
    
    The questions must be structured as follows:
    - 6 Technical questions assessing domain knowledge, coding paradigms, architecture, and problem solving.
    - 2 Behavioral questions assessing teamwork, conflict resolution, and soft skills.
    - 2 HR questions assessing alignment, motivation, and career expectations.

    Return the results STRICTLY in JSON format with a JSON array containing objects matching this schema:
    [
      {
        "questionId": 1,
        "questionText": "Question string here...",
        "category": "Technical" // Must be 'Technical', 'Behavioral', or 'HR'
      }
    ]
    
    Do not add markdown annotations outside of the JSON block itself.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini Generate Questions Error: ", error);
    throw new Error(`AI question generation failed: ${error.message}`);
  }
};

/**
 * Helper to evaluate answers for a complete interview
 */
exports.evaluateAnswers = async (questionsAndAnswers, jobRole, difficulty) => {
  if (isMockMode()) {
    console.warn("Running in Gemini Mock Mode: Evaluating answers with mock feedback.");
    const questionsFeedback = questionsAndAnswers.map(qa => ({
      questionId: qa.questionId,
      feedback: {
        score: Math.floor(Math.random() * 4) + 7, // 7 to 10
        technicalAccuracy: Math.floor(Math.random() * 4) + 7,
        communicationQuality: Math.floor(Math.random() * 4) + 7,
        clarity: Math.floor(Math.random() * 4) + 7,
        confidenceEstimation: Math.random() > 0.3 ? 'High' : 'Medium',
        suggestions: `To improve on "${qa.questionText.substring(0, 30)}...", explain concepts with specific examples.`
      }
    }));

    const scores = questionsFeedback.map(q => q.feedback.score);
    const avgScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10);

    return {
      questions: questionsFeedback,
      overallScore: avgScore,
      strengths: [
        `Solid understanding of core concepts relative to ${jobRole} requirements.`,
        "Fluent communication and structured explanations."
      ],
      weaknesses: [
        `Could elaborate on edge cases in hard technical concepts.`,
        "Occasional filler words."
      ],
      actionPlan: [
        "Read articles on advanced architectural concepts.",
        "Practice mock verbal answers with a timer to improve flow."
      ]
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a Senior Technical Recruiter and Engineering Manager. Analyze the candidate's answers to the interview questions.
    Job Role: ${jobRole}
    Difficulty: ${difficulty}
    
    Here is the list of questions and candidate answers:
    ${JSON.stringify(questionsAndAnswers, null, 2)}
    
    Evaluate each answer and rate them from 1 to 10. Compute scores for:
    - score (overall score for the question)
    - technicalAccuracy (relevance, accuracy, code patterns)
    - communicationQuality (jargon utilization, narrative style)
    - clarity (directness, lack of run-on sentences)
    - confidenceEstimation (estimation: 'Low', 'Medium', 'High')
    - suggestions (specific tips to improve the specific answer)

    Also compile:
    - overallScore (integrated overall index from 0 to 100)
    - strengths (array of general user strengths)
    - weaknesses (array of general areas for improvement)
    - actionPlan (concrete step-by-step points for the user to practice)

    Return the evaluation STRICTLY in JSON format matching this exact schema:
    {
      "questions": [
        {
          "questionId": 1,
          "feedback": {
            "score": 8,
            "technicalAccuracy": 8,
            "communicationQuality": 7,
            "clarity": 8,
            "confidenceEstimation": "High",
            "suggestions": "Your answer covers basic concepts. You could improve by mentioning X, Y, and Z."
          }
        }
      ],
      "overallScore": 82,
      "strengths": ["Strengths list item 1", "Strengths list item 2"],
      "weaknesses": ["Weakness list item 1", "Weakness list item 2"],
      "actionPlan": ["Action plan step 1", "Action plan step 2"]
    }
    
    Do not add extra markdown wrap besides standard JSON structure.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini Evaluate Answers Error: ", error);
    throw new Error(`AI answer evaluation failed: ${error.message}`);
  }
};

/**
 * Helper to analyze a resume based on parsed text
 */
exports.analyzeResumeText = async (parsedText) => {
  if (isMockMode()) {
    console.warn("Running in Gemini Mock Mode: Analyzing resume with mock metrics.");
    return {
      skillsExtracted: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "MongoDB"],
      missingSkills: ["TypeScript", "Docker", "AWS", "CI/CD"],
      atsScore: 78,
      recommendations: [
        "Incorporate measurable outcomes (e.g. 'boosted speeds by 40%') in your project details.",
        "Add TypeScript and AWS cloud hosting credentials to match modern stack listings.",
        "Verify formatting alignment to maintain parsing structures."
      ]
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert ATS (Applicant Tracking System) parser and Professional Resume Coach. Read the following parsed resume text:
    ---
    ${parsedText}
    ---
    
    Perform a complete audit:
    1. Extract all technical and soft skills (skillsExtracted).
    2. Check industry standards for generic web development and engineering roles. Identify standard modern tools/skills that are missing or underrepresented in this resume (missingSkills).
    3. Generate a realistic ATS score (atsScore) between 0 and 100 representing compliance with standard parser requirements (formatting, headers, bullet actions, skill densities).
    4. Compile actionable bulleted feedback items (recommendations) detailing how the candidate can structure or rewrite sections to increase their ATS score.

    Return the evaluation STRICTLY in JSON format matching this exact schema:
    {
      "skillsExtracted": ["Skill 1", "Skill 2"],
      "missingSkills": ["Missing Skill 1", "Missing Skill 2"],
      "atsScore": 85,
      "recommendations": ["Recommendation 1", "Recommendation 2"]
    }
    
    Do not include markdown decorations outside of standard JSON block.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini Analyze Resume Error: ", error);
    throw new Error(`AI resume analysis failed: ${error.message}`);
  }
};

/**
 * Helper to generate a personalized career roadmap
 */
exports.generateRoadmap = async (currentSkills, cgpa, targetRole) => {
  if (isMockMode()) {
    console.warn("Running in Gemini Mock Mode: Generating mock roadmap.");
    return {
      weeklyPlan: Array.from({ length: 6 }, (_, i) => ({
        week: i + 1,
        focus: `Mastering advanced concepts for ${targetRole} - Block ${i + 1}`,
        topics: [`Topic ${i * 2 + 1}`, `Topic ${i * 2 + 2}`],
        tasks: [`Complete challenge ${i + 1}`, `Deploy project milestone ${i + 1}`]
      })),
      recommendedProjects: [
        {
          title: `E-commerce Dashboard for ${targetRole}s`,
          description: "Build an analytical panel using standard industry stacks to demonstrate handling state and complex datasets.",
          techStack: [...currentSkills.slice(0, 3), "Tailwind CSS", "Chart.js"]
        }
      ],
      certifications: [`AWS Cloud Practitioner`, `Google Professional Developer`],
      placementPrepPlan: `Focus on coding challenges, maintain a ${cgpa} profile with good project explanations, and drill down on mock interviews daily.`
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a Career Architect and Academic Advisor. Devise a personalized learning roadmap.
    Target Role: ${targetRole}
    Current Skills: ${JSON.stringify(currentSkills)}
    CGPA: ${cgpa}
    
    Generate:
    1. A detailed 6-week study schedule (weeklyPlan) consisting of weekly focuses, bulleted topics, and specific tasks.
    2. Exactly 2 highly relevant project recommendations (recommendedProjects) featuring descriptive layouts and a technical stack tailored to bridge their skill gaps.
    3. Suggested industrial certifications (certifications) they should acquire to stand out.
    4. An overall placement preparation strategy (placementPrepPlan) addressing CGPA implications, interview timelines, and resume guidelines.

    Return the roadmap STRICTLY in JSON format matching this exact schema:
    {
      "weeklyPlan": [
        {
          "week": 1,
          "focus": "Focus title here",
          "topics": ["Topic A", "Topic B"],
          "tasks": ["Task A", "Task B"]
        }
      ],
      "recommendedProjects": [
        {
          "title": "Project Title",
          "description": "Project description detailing architectural guidelines.",
          "techStack": ["React", "Express", "Node"]
        }
      ],
      "certifications": ["Certification 1", "Certification 2"],
      "placementPrepPlan": "Detailed text detailing general strategy..."
    }
    
    Do not add extra formatting details.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini Generate Roadmap Error: ", error);
    throw new Error(`AI roadmap generation failed: ${error.message}`);
  }
};
