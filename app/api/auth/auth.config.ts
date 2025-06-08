import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/models/User";
import connectDB from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenziali non valide");
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("Credenziali non valide");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Credenziali non valide");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        await connectDB();
        const freshUser = await User.findOne({ email: token.email });
        if (freshUser) {
          token.name = freshUser.name;
          token.email = freshUser.email;
          token.role = freshUser.role;
        }
      } else if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
