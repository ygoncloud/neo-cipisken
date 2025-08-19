# Cipisken AI CV Analyzer

This is a CV analyzer that uses AI to provide feedback on your resume.

## Features

*   Analyzes CVs in PDF format.
*   Provides feedback on searchability, hard skills, soft skills, recruiter tips, and formatting.
*   Generates an ATS compatibility score.
*   Allows users to paste a job description for more targeted feedback.
*   Customizable UI theme.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **AI:** [Google Gemini](https://ai.google/discover/gemini/)
*   **PDF Parsing:** [pdf-parse](https://www.npmjs.com/package/pdf-parse)
*   **File Sanitization:** [sanitize-filename](https://www.npmjs.com/package/sanitize-filename)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v20 or later)
*   npm

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username/neo-cipisken-nextjs.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Create a `.env.local` file in the root of the project and add your Gemini API key:


### Running the Application

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1.  Upload your CV in PDF format.
2.  (Optional) Paste a job description.
3.  Click the "Analyze CV" button.
4.  The AI will provide feedback on your CV.
