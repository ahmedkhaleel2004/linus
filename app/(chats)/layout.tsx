"use client";

import Sidebar from "@/components/component/sidebar";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/component/navbars/mode-toggle";
import ProfileIcon from "@/components/component/navbars/profile-icon";

interface ChatLayoutProps {
	children: React.ReactNode;
}

function ChatLayout({ children }: ChatLayoutProps) {
	const [loggedIn, setLoggedIn] = useState(false);
	const [userId, setUserId] = useState("");
	const router = useRouter();

	useEffect(() => {
		const checkAuthState = async () => {
			const unsubscribe = onAuthStateChanged(auth, async (user) => {
				if (user) {
					setUserId(user.uid);
					setLoggedIn(true);
					const docRef = doc(db, "users", user.uid);
					const docSnap = await getDoc(docRef);
					if (!docSnap.data()?.doneSurvey) {
						router.push("/survey");
					}
				} else {
					router.push("/");
				}
			});

			// Cleanup subscription on unmount
			return () => unsubscribe();
		};

		checkAuthState();
	}, [router]);

	return (
		<div className="flex h-screen">
			<Sidebar userId={userId} loggedIn={loggedIn} />
			<div className="flex grow overflow-hidden pl-0">
				<div className="flex flex-col w-full h-full overflow-auto">
					{children}
				</div>
			</div>
			<div className="flex top-5 right-5 fixed space-x-4">
				<ModeToggle />
				<ProfileIcon />
			</div>
		</div>
	);
}

export default ChatLayout;