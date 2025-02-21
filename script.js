// Fetch WHOIS Data
async function fetchWhois() {
    let domain = document.getElementById("domainInput").value.trim();
    if (!domain) {
        alert("Please enter a valid domain name.");
        return;
    }

    document.getElementById("domain").textContent = domain;
    document.getElementById("registrar").textContent = "Fetching...";
    document.getElementById("registeredDate").textContent = "Fetching...";
    document.getElementById("expirationDate").textContent = "Fetching...";

    try {
        let response = await fetch(`https://rdap.org/domain/${domain}`);
        if (!response.ok) throw new Error("Invalid domain or RDAP error");

        let data = await response.json();

        // Extract WHOIS data
        document.getElementById("registeredDate").textContent =
            data.events?.find((event) => event.eventAction === "registration")?.eventDate?.split("T")[0] ||
            "Not Available";
        document.getElementById("expirationDate").textContent =
            data.events?.find((event) => event.eventAction === "expiration")?.eventDate?.split("T")[0] ||
            "Not Available";

        let registrar = "Unknown";
        if (data.entities) {
            for (let entity of data.entities) {
                if (entity.roles?.includes("registrar")) {
                    registrar = entity.handle || "Unknown Registrar";
                    break;
                }
            }
        }
        document.getElementById("registrar").textContent = registrar;
    } catch (error) {
        console.error("Error fetching WHOIS data:", error);
        document.getElementById("registrar").textContent = "Error fetching data";
        document.getElementById("registeredDate").textContent = "Error fetching data";
        document.getElementById("expirationDate").textContent = "Error fetching data";
    }
}
async function fetchIpAddress() {
    let domain = document.getElementById("domainInput").value.trim();
    if (!domain) return;
    document.getElementById("ipAddress").textContent = "Fetching";
    try {
        let dnsResponse = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=A`, {
            headers: { Accept: "application/dns-json" }
        });
        let dnsData = await dnsResponse.json();
        let ipAddress = dnsData?.Answer?.[0]?.data || "Not Found";
        document.getElementById("ipAddress").textContent = ipAddress;
    } catch (error) {
        console.error("Fetching IP:", error);
        document.getElementById("ipAddress").textContent = "Error";
    }
}
async function fetchLocation() {
    let ip = document.getElementById("ipAddress").textContent;
    if (!ip || ip === "Fetching..." || ip === "Not Found") return;

    document.getElementById("location").textContent = "Fetching...";
    document.getElementById("timezone").textContent = "Fetching...";

    try {
        let geoResponse = await fetch(`https://ipinfo.io/${ip}/json`);
        let geoData = await geoResponse.json();

        document.getElementById("location").textContent = `${geoData.city || "Unknown City"}, ${geoData.country || "Unknown Country"}`;
        document.getElementById("timezone").textContent = geoData.timezone || "Unknown Timezone";

    } catch (error) {
        console.error("Error fetching location:", error);
        document.getElementById("location").textContent = "Error fetching data";
        document.getElementById("timezone").textContent = "Error fetching data";
    }
}
