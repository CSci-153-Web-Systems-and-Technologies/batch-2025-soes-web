import { LucideIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import React from "react";

interface LandingCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  type?: "one";
}

const LandingCardOne = ({ Icon, title, description }: LandingCardProps) => {
  return (
    <Card className="hover:shadow-foreground shadow-2xl/20 shadow-background transition-shadow">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 bg-green-900/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-green-800" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

const LandingCardTwo = ({ Icon, title, description }: LandingCardProps) => {
  return <section></section>;
};

const LandingCard = ({ Icon, title, description, type }: LandingCardProps) => {
  return (
    <div>
      {type === "one" ? (
        <LandingCardOne Icon={Icon} title={title} description={description} />
      ) : (
        <LandingCardTwo Icon={Icon} title={title} description={description} />
      )}
    </div>
  );
};

export default LandingCard;
