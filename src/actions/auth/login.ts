'use server';
 
import { signIn } from '../../../auth.config';

 
// ...
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
console.log(formData);
    // await sleep(2)
    await signIn('credentials', 
      {...Object.fromEntries(formData),
        redirect:false
      }
    );

    return 'Success'
    
  } catch (error) {

    console.log(error);
   if((error as any).type === 'CredentialsSignin'){
    
     return 'CredentialsSignin'
   }

   return 'UnknownError'

  }
}