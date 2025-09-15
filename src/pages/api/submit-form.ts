import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if request has body
    if (!request.body) {
      throw new Error('No request body provided');
    }
    
    const formData = await request.json();
    console.log('Received form data:', formData);
    
    // Forward to Zapier webhook
    const zapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/1723739/umhqlyp/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    if (!zapierResponse.ok) {
      throw new Error(`Zapier webhook failed: ${zapierResponse.status}`);
    }

    const result = await zapierResponse.json();
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Form submitted successfully',
      zapierResponse: result 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('Form submission error:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Failed to submit form',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
};
