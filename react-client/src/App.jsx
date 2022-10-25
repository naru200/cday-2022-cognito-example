import { useAuth } from "react-oidc-context";
import { useState } from "react";

import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid/index.js";
import Logo from "./assets/cday-logo.png";

const App = () => {
  const auth = useAuth();

  const [specialResult, setSpecialResult] = useState("");

  const onSignOut = async () => {
    await auth.removeUser();
    location.replace(
      `${import.meta.env.VITE_COGNITO_ENDPOINT}/logout?client_id=${
        import.meta.env.VITE_COGNITO_CLIENT_ID
      }&logout_uri=${import.meta.env.VITE_BASE_URL}`
    );
  };

  const getAccess = async () => {
    const result = await fetch(
      import.meta.env.VITE_BACKEND_ENDPOINT + "/grant-access",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.user.access_token}`,
        },
      }
    ).then((res) => res.json());

    alert(result.message);
  };

  const getSpecialResult = async () => {
    const result = await fetch(
      import.meta.env.VITE_BACKEND_ENDPOINT + "/give-me-a-cat",
      {
        headers: {
          Authorization: `Bearer ${auth.user.access_token}`,
        },
      }
    ).then((res) => res.json());
    setSpecialResult(result.image);
  };

  return (
    <>
      {auth.isAuthenticated ? (
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <img
                className="mx-auto max-h-24 object-cover"
                src={Logo}
                alt=""
              />
              <div className="text-center mt-6 text-xl">
                <span>You are signed in to</span>
                <span className="font-bold text-orange-500">{` ${auth.user.profile.email}`}</span>
              </div>
              <button
                onClick={getAccess}
                type="button"
                className="flex w-full justify-center items-center rounded-md bg-gray-100 px-4 py-2 mt-6
                  text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none"
              >
                Get permission
              </button>
              <button
                onClick={getSpecialResult}
                type="button"
                className="flex w-full justify-center items-center rounded-md border border-transparent bg-orange-500 px-4 py-2 mt-2
                  text-base font-semibold text-white shadow-sm hover:bg-orange-600 focus:outline-none"
              >
                Special feature (requires permission)
              </button>

              {!!specialResult && (
                <img
                  className="mt-4 mx-auto max-h-64 object-cover"
                  src={specialResult}
                  alt=""
                />
              )}

              <button
                onClick={onSignOut}
                type="button"
                className="flex w-full justify-center items-center rounded-md border-2 border-red-300 bg-white px-4 py-2 mt-6
                  text-base font-medium text-red-700 shadow-sm hover:bg-gray-50 focus:outline-none"
              >
                <ArrowRightOnRectangleIcon
                  className="-ml-1 mr-3 h-5 w-5 min-w-[20px] min-h-[20px]"
                  aria-hidden="true"
                />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <img
                className="mx-auto max-h-24 object-cover"
                src={Logo}
                alt=""
              />

              <button
                onClick={auth.signinRedirect}
                type="button"
                className="flex w-full justify-center items-center rounded-md border border-transparent bg-orange-500 px-4 py-2 mt-8 text-base font-semibold text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                <ArrowLeftOnRectangleIcon
                  className="-ml-1 mr-3 h-5 w-5 min-w-[20px] min-h-[20px]"
                  aria-hidden="true"
                />
                Sign In with Amazon Cognito
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
