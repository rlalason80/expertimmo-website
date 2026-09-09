import urllib.request
import json
import sys

# Configuration
HOST = "www.expertimmo.mg"
KEY = "7309edb04afe4194aa2956483188e1de"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"
API_URL = "https://api.indexnow.org/indexnow"

def submit_urls(urls):
    """
    Soumet une liste d'URLs à l'API IndexNow de Bing.
    """
    # Nettoyage et formatage des URLs
    formatted_urls = []
    for url in urls:
        url = url.strip()
        if not url:
            continue
        # S'assurer que l'URL est complète
        if not url.startswith("http"):
            # Si c'est un chemin relatif (ex: /articles/test.html), on ajoute le domaine
            if not url.startswith("/"):
                url = "/" + url
            url = f"https://{HOST}{url}"
        formatted_urls.append(url)

    if not formatted_urls:
        print("Aucune URL valide à soumettre.")
        return

    # Préparation des données JSON
    data = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": formatted_urls
    }

    json_data = json.dumps(data).encode('utf-8')

    print(f"📡 Soumission de {len(formatted_urls)} URL(s) à IndexNow...")
    for u in formatted_urls:
        print(f"  - {u}")

    # Préparation de la requête HTTP
    req = urllib.request.Request(API_URL, data=json_data, headers={
        'Content-Type': 'application/json; charset=utf-8'
    })

    try:
        # Envoi de la requête
        with urllib.request.urlopen(req) as response:
            status_code = response.getcode()
            if status_code == 200:
                print("\n✅ Succès (Code 200) : Les URLs ont bien été soumises et acceptées par Bing/IndexNow.")
            elif status_code == 202:
                print("\n✅ Succès (Code 202) : Les URLs ont été reçues, mais la clé est en cours de validation.")
            else:
                print(f"\n⚠️ Réponse inattendue (Code {status_code}).")
    except urllib.error.HTTPError as e:
        status_code = e.code
        if status_code == 400:
            print("\n❌ Erreur 400 : Mauvaise requête (format invalide).")
        elif status_code == 403:
            print(f"\n❌ Erreur 403 : Accès refusé (Clé invalide ou fichier {KEY}.txt introuvable sur le serveur).")
        elif status_code == 422:
            print("\n❌ Erreur 422 : Les URLs n'appartiennent pas au domaine spécifié ou la clé ne correspond pas.")
        elif status_code == 429:
            print("\n❌ Erreur 429 : Trop de requêtes (Quota dépassé).")
        else:
            print(f"\n❌ Erreur {status_code} : {e.reason}")
    except Exception as e:
        print(f"\n❌ Erreur lors de la connexion : {e}")

if __name__ == "__main__":
    print("=== Outil de Soumission IndexNow - ExpertImmo ===")

    # Si des URLs sont passées en arguments de ligne de commande
    if len(sys.argv) > 1:
        submit_urls(sys.argv[1:])
    else:
        # Mode interactif
        print("Entrez les URLs ou les chemins des pages que vous venez de mettre à jour ou créer.")
        print("(Exemple complet: https://expertimmo.mg/nouvelle-page ou chemin: /articles/nouvelle-page)")
        print("Appuyez sur Entrée sans rien taper pour terminer la saisie et envoyer.\n")

        urls_to_submit = []
        while True:
            try:
                user_input = input("URL/Chemin > ")
                if not user_input.strip():
                    break
                urls_to_submit.append(user_input)
            except EOFError:
                break

        if urls_to_submit:
            submit_urls(urls_to_submit)
        else:
            print("Action annulée.")
