import { getServerSession } from 'next-auth/next';
import { getNextAuthOptions } from '../pages/api/auth/[...nextauth]';
import axios from 'axios';

export function findMatchingItem(menuData, url) {
    for (const item of menuData) {
        if (item.to && new RegExp(`^${item.to}(\/|$)`).test(url)) {
            return true;
        }

        if (item.items) {
            const matchedItem = findMatchingItem(item.items, url);
            if (matchedItem) {
                return true;
            }
        }
    }

    return false;
}

// cek apakah punya session
export function getSessionServerSide(context, searchUrl) {
    return new Promise(async (resolve) => {
        const sessionData = await getServerSession(context.req, context.res, getNextAuthOptions(context.req, context.res));
        if (!sessionData?.user) {
            resolve({
                redirect: {
                    permanent: false,
                    destination: '/login'
                }
            });
            return;
        }

        let urlFix = searchUrl;
        //jika searchUrl character string lebih dari 1
        if (searchUrl.length > 1) {
            urlFix = searchUrl.replace(new RegExp(/\/$/), '');
        }
        // looping data session menu
        const res = findToValuesRecursive(sessionData.user.menu, urlFix);

        if (res.length < 1) {
            return resolve({
                redirect: {
                    permanent: false,
                    destination: '/'
                }
            });
        }

        resolve(sessionData);
    });
}

export function findNonEmptyToRecursive(data) {
    for (let i = 0; i < data.length; i++) {
        const item = data[i];

        if (item.to !== null && item.to !== undefined) {
            return item.to;
        }

        if (item.items && Array.isArray(item.items)) {
            const nestedTo = findNonEmptyToRecursive(item.items);
            if (nestedTo !== null && nestedTo !== undefined) {
                return nestedTo;
            }
        }
    }

    return null;
}

function findToValuesRecursive(data, searchToValue) {
    const matchingData = [];

    function search(item) {
        //prop to sesuai
        if (item.to === searchToValue) {
            matchingData.push(item);
        }

        if (item.items && Array.isArray(item.items)) {
            //check items dan recursif
            item.items.forEach((subItem) => search(subItem));
        }
    }

    data.forEach((item) => search(item));

    return matchingData;
}

export async function checkUserHadPlugins(email, plugin) {
    try {
        const res = await axios.post(`${process.env.API_URL}/api/plugin/checkpluginuser`, { email });

        if (res.data.length === 0 || res.statusText !== 'OK') {
            console.log(res);
            return { redirect: { permanent: false, destination: '/' } };
        }

        const hasPlugin = res.data.some((dt) => dt.nama.toLowerCase() === plugin.toLowerCase());

        if (!hasPlugin) {
            console.log(res);
            return { redirect: { permanent: false, destination: '/' } };
        }

        return res;
    } catch (error) {
        console.error(error);
        return { redirect: { permanent: false, destination: '/' } };
    }
}
