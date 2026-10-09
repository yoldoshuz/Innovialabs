import ru from "@/lib/i18n/dictionaries/ru.json";
import en from "@/lib/i18n/dictionaries/en.json";
import uz from "@/lib/i18n/dictionaries/uz.json";
import { NotFoundView } from "@/components/layout/not-found-view";

/**
 * not-found has no access to route params, so the (tiny) copy for every
 * locale is passed down and the client view picks one from the URL.
 */
export default function NotFound() {
  return <NotFoundView copy={{ ru: ru.notFound, en: en.notFound, uz: uz.notFound }} />;
}
