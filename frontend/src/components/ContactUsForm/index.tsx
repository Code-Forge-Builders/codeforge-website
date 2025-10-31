import { fetchCountryData } from "./fetchCountryData";
import { ContactUsFormClientComponent } from "./ContactUsClientComponent";

export async function ContactUsForm() {

  const countryData = await fetchCountryData();

  return <ContactUsFormClientComponent countryData={countryData} />
}
