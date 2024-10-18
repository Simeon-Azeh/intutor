import Footer from "@/components/footer";
import SignInForm from "@/components/forms/SignInForm";
import Header from "@/components/Header";

const SignInPage = () => {
  return (
    <main>
        <div className="top-0 sticky">
        <Header />
        </div>
       
      <SignInForm />
   <div className="pb-4">
   <p className="text-center text-md font-medium text-gray-500">&copy; {new Date().getFullYear()} Intutor. All Rights Reserved •   <a href="">Privacy Policy</a></p>
  
   </div>
    </main>
  );
};

export default SignInPage;
