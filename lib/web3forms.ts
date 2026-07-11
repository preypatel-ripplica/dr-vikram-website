const WEB3FORMS_ACCESS_KEY = "df479ac0-0425-44f8-bc01-75d99bd99514";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

type Web3FormsResponse = {
  message?: string;
  success?: boolean;
};

export async function submitWeb3Form(form: HTMLFormElement) {
  const formData = new FormData(form);
  formData.append("access_key", WEB3FORMS_ACCESS_KEY);

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as Web3FormsResponse;

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Unable to send message.");
  }
}
