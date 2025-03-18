import {
  NextResponse
} from 'next/server';
import OpenAI from 'openai';
import {
  z
} from "zod";
import {
  zodResponseFormat
} from 'openai/helpers/zod';

export const maxDuration = 300;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define Zod schemas matching our interfaces
const ApplicantSchema = z.object({
  name: z.string(),
  gender: z.string(),
  class: z.string(),
  dependents: z.number(),
  houses: z.number(),
  debt: z.number(),
  liquidity: z.number(),
  income: z.number(),
  pension: z.number(),
  automobiles: z.number(),
  history: z.string(),
  reason: z.string(),
});

const MessageSchema = z.object({
  message: z.string(),
  speaker: z.literal('bot'),
});

// Schema for the API response
const ResponseSchema = z.object({
  Applicant: ApplicantSchema,
  message: MessageSchema,
});

export async function POST(request){
  try {
    const { Applicant, messages } = await request.json();
    const formattedMessages = [
      { 
        role: "system", 
        content: `You are a banker who helps fill out loan applications for clients.
        Work with them to get the most up to date information! 
        Here is some secret information you have about the client which may not match what they enter.
        - they are 35 years old.
        - they are married.
        - they have 2 children.
        - they are a homeowner.
        - they have a job as a software engineer.
        - they have a credit score of 750.
        - they are looking to borrow $20,000.
         1. They are looking for a 5-year loan term.
         2. They have a monthly income of $5,000.
         3. They have no other debts.
         4. They are looking for a low-interest rate.
         5. They are willing to provide collateral.
         6. They have a good payment history.
         7. They are looking for a fixed-rate loan.
         8. They are looking for a loan for home improvement.
        - they have a pet cat named Fluffy.`
        
      },
      {
        role: "system",
        content: `Current Applicant details:
          Name: ${Applicant.name || 'Not specified'}
          Gender: ${Applicant.gender || 'Not specified'}
          Occupation: ${Applicant.occupation || 'Not specified'}
          Level: ${Applicant.level || 1}
          Stats: STR ${Applicant.automobiles}, DEX ${Applicant.houses}, CON ${Applicant.debt}, 
                INT ${Applicant.liquidity}, WIS ${Applicant.income}, CHA ${Applicant.pension}
          Background: ${Applicant.history || 'Not specified'}
          reason: ${Applicant.reason || 'Not specified'}`
      }
    ];
    messages.forEach((msg, index) => {
      const role = msg.speaker === 'user' ? 'user' : 'assistant';
      const newMessage = { role: role, content: msg.message };
      formattedMessages.push(newMessage);
    });
    
    // Get response from OpenAI using zodResponseFormat helper
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: formattedMessages,
      response_format: zodResponseFormat(ResponseSchema, 'Applicant_creation_update'),
    });
    
    // Extract the parsed response
    const validatedResponse = completion.choices[0].message.parsed;
    
    return NextResponse.json( validatedResponse );
  }
  catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
};