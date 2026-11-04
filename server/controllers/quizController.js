import { Question } from "../models/Question.js";

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: 1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const { question, options, answerIndex } = req.body;
    const newQuestion = new Question({
      question,
      options,
      answerIndex,
      createdBy: req.user?._id
    });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { question, options, answerIndex } = req.body;
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { question, options, answerIndex },
      { new: true }
    );
    if (!updatedQuestion) return res.status(404).json({ error: "Question not found" });
    res.json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) return res.status(404).json({ error: "Question not found" });
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const seedQuestions = async () => {
  try {
    const count = await Question.countDocuments();
    if (count === 0) {
      const defaultQuestions = [
        {
          question: "What is the strategic role of HR in an organization?",
          options: [
            "Ensuring compliance with laws and regulations",
            "Aligning HR policies with business goals and driving organizational growth",
            "Managing day-to-day employee grievances",
            "Processing payroll and benefits"
          ],
          answerIndex: 1
        },
        {
          question: "Which of the following describes human capital management?",
          options: [
            "Tracking employee attendance",
            "Viewing employees as assets to invest in for maximizing organizational value",
            "A method of conducting annual appraisals",
            "Ensuring compliance with workplace regulations"
          ],
          answerIndex: 1
        },
        {
          question: "What is the main objective of job evaluation?",
          options: [
            "Enhancing employee satisfaction",
            "Determining the relative worth of a job within an organization",
            "Assessing employee performance",
            "Streamlining recruitment processes"
          ],
          answerIndex: 1
        },
        {
          question: "What is constructive dismissal?",
          options: [
            "When an employer terminates an employee for gross misconduct",
            "When an employee is forced to resign due to employer's behavior",
            "A layoff due to redundancy",
            "A termination following performance reviews"
          ],
          answerIndex: 1
        },
        {
          question: "Which HR strategy is most effective in fostering innovation?",
          options: [
            "Strict performance management",
            "Diversity and inclusion practices",
            "Micromanagement of teams",
            "Lengthy hierarchical approval processes"
          ],
          answerIndex: 1
        },
        {
          question: "What is the key purpose of competency-based interviews?",
          options: [
            "To focus on behavioral evidence for specific skills",
            "To assess only technical qualifications",
            "To check cultural fit",
            "To review resumes in-depth"
          ],
          answerIndex: 0
        },
        {
          question: "What does the balanced scorecard method measure in HR?",
          options: [
            "Employee satisfaction",
            "Financial, customer, internal processes, and learning & growth metrics",
            "Training effectiveness",
            "Workforce diversity"
          ],
          answerIndex: 1
        },
        {
          question: "What is employer branding?",
          options: [
            "Creating a positive public image of the organization to attract top talent",
            "Designing company logos and promotional materials",
            "Standardizing recruitment processes",
            "Improving workplace safety policies"
          ],
          answerIndex: 0
        },
        {
          question: "What is labor market segmentation?",
          options: [
            "Dividing employees into performance tiers",
            "Classifying job markets into distinct subgroups based on skills, industries, or demographics",
            "Evaluating competition for talent",
            "Ranking employees based on engagement surveys"
          ],
          answerIndex: 1
        },
        {
          question: "What does the term VUCA represent in the context of HR?",
          options: [
            "Vision, Understanding, Control, Action",
            "Volatility, Uncertainty, Complexity, Ambiguity",
            "Value, Unity, Collaboration, Agility",
            "Virtual, Unified, Consistent, Agile"
          ],
          answerIndex: 1
        },
        {
          question: "What is the primary focus of HRIS (Human Resource Information System)?",
          options: [
            "Automating HR processes and managing employee data",
            "Conducting diversity training",
            "Designing employee wellness programs",
            "Leading organizational restructuring"
          ],
          answerIndex: 0
        },
        {
          question: "What is the purpose of a human resource audit?",
          options: [
            "Reviewing the financial records of HR",
            "Evaluating HR policies, practices, and compliance to improve effectiveness",
            "Tracking employee performance ratings",
            "Approving hiring budgets"
          ],
          answerIndex: 1
        },
        {
          question: "What does Total Rewards encompass in HR?",
          options: [
            "Only direct compensation",
            "Direct compensation, benefits, work-life balance, performance recognition, and development opportunities",
            "Training budgets only",
            "Retirement plans"
          ],
          answerIndex: 1
        }
      ];
      await Question.insertMany(defaultQuestions);
      console.log("Database seeded with exactly 10 default HR quiz questions.");
    }
  } catch (error) {
    console.error("Error seeding questions:", error);
  }
};
